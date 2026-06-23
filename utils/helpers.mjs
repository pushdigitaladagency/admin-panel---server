import { Op } from 'sequelize';

// URL-safe slug from arbitrary text.
export const slugify = (text) =>
    String(text)
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 200) || 'item';

// Returns a slug unique within `model`, appending -2, -3, ... on collision.
// `excludeId` lets an update keep its own slug.
export const uniqueSlug = async (model, base, excludeId = null) => {
    const root = slugify(base);
    let candidate = root;
    let n = 1;
    /* eslint-disable no-await-in-loop */
    while (true) {
        const where = { slug: candidate };
        if (excludeId) where.id = { [Op.ne]: excludeId };
        const clash = await model.findOne({ where, paranoid: false, attributes: ['id'] });
        if (!clash) return candidate;
        n += 1;
        candidate = `${root}-${n}`;
    }
};

// Short unique reference number for enquiries, e.g. ENQ-20260622-AB12CD.
export const referenceNo = (prefix = 'ENQ') => {
    const d = new Date();
    const ymd = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
    const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
    return `${prefix}-${ymd}-${rand}`;
};

// Pick only whitelisted keys that are present in the body.
export const pickFields = (body, fields) =>
    fields.reduce((acc, key) => {
        if (body[key] !== undefined) acc[key] = body[key];
        return acc;
    }, {});

// Map Sequelize errors to HTTP responses; falls through to 500 otherwise.
export const handleError = (res, error) => {
    if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(409).json({
            success: false,
            error: error.errors?.map((e) => e.message).join(', ') || 'Duplicate value'
        });
    }
    if (error.name === 'SequelizeValidationError') {
        return res.status(400).json({
            success: false,
            error: error.errors?.map((e) => e.message).join(', ') || 'Validation error'
        });
    }
    if (error.name === 'SequelizeForeignKeyConstraintError') {
        return res.status(409).json({
            success: false,
            error: 'Related record missing or still in use'
        });
    }
    return res.status(500).json({ success: false, error: 'Internal server error' });
};
