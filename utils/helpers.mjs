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
    // Bad client input that reaches MySQL directly (e.g. a value outside an ENUM
    // such as setting press_releases.status / events.publish_status to 'Archived',
    // a value too long for the column, or the wrong type). MySQL raises these as
    // DatabaseErrors; treat them as 400, not an unhandled 500.
    if (error.name === 'SequelizeDatabaseError') {
        const code = error.parent?.code ?? error.original?.code;
        const errno = error.parent?.errno ?? error.original?.errno;
        const BAD_INPUT_CODES = new Set([
            'WARN_DATA_TRUNCATED',          // 1265 - value outside ENUM / wrong type
            'ER_DATA_TOO_LONG',             // 1406 - value too long for column
            'ER_TRUNCATED_WRONG_VALUE',     // 1292 - wrong value (e.g. bad date/number)
            'ER_TRUNCATED_WRONG_VALUE_FOR_FIELD', // 1366
            'ER_WRONG_VALUE',
            'ER_BAD_NULL_ERROR'             // 1048 - required column set to null
        ]);
        const BAD_INPUT_ERRNO = new Set([1265, 1406, 1292, 1366, 1048]);
        if (BAD_INPUT_CODES.has(code) || BAD_INPUT_ERRNO.has(errno)) {
            return res.status(400).json({ success: false, error: 'Invalid value for one or more fields' });
        }
    }
    return res.status(500).json({ success: false, error: 'Internal server error' });
};
