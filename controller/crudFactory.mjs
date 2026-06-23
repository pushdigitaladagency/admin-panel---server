import { Op } from 'sequelize';
import { pickFields, handleError, uniqueSlug } from '../utils/helpers.mjs';

// Builds a consistent set of REST handlers for a model.
//
// options:
//   include       - associations to eager-load on list/get
//   attributes    - Sequelize attributes option (e.g. exclude password)
//   writable      - whitelist of client-settable fields
//   audit         - set created_by/updated_by from req.user (default false)
//   slugFrom      - field to derive a unique slug from (e.g. 'title')
//   filterFields  - query params allowed as exact-match list filters
//   searchFields  - fields matched (LIKE) by ?search=
//   defaultOrder  - default ORDER BY, e.g. [['created_at','DESC']]
//   notFound      - 404 message
export const crudController = (model, options = {}) => {
    const {
        include = [],
        attributes,
        writable = [],
        audit = false,
        slugFrom = null,
        filterFields = [],
        searchFields = [],
        defaultOrder = [['created_at', 'DESC']],
        notFound = 'Record not found'
    } = options;

    const findOptions = () => {
        const opt = { include };
        if (attributes) opt.attributes = attributes;
        return opt;
    };

    const list = async (req, res) => {
        try {
            const where = {};
            for (const f of filterFields) {
                if (req.query[f] !== undefined) where[f] = req.query[f];
            }
            if (req.query.search && searchFields.length) {
                where[Op.or] = searchFields.map((f) => ({ [f]: { [Op.like]: `%${req.query.search}%` } }));
            }

            const page = Math.max(1, parseInt(req.query.page, 10) || 1);
            const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 20));

            const { rows, count } = await model.findAndCountAll({
                ...findOptions(),
                where,
                order: defaultOrder,
                limit,
                offset: (page - 1) * limit,
                distinct: true
            });

            res.json({
                success: true,
                data: rows,
                meta: { total: count, page, limit, pages: Math.ceil(count / limit) }
            });
        } catch (error) {
            handleError(res, error);
        }
    };

    const getById = async (req, res) => {
        try {
            const record = await model.findByPk(req.params.id, findOptions());
            if (!record) return res.status(404).json({ success: false, error: notFound });
            res.json({ success: true, data: record });
        } catch (error) {
            handleError(res, error);
        }
    };

    const create = async (req, res) => {
        try {
            const data = pickFields(req.body, writable);
            if (slugFrom) {
                data.slug = await uniqueSlug(model, req.body.slug || req.body[slugFrom] || '');
            }
            if (audit) data.created_by = req.user?.id ?? null;

            const created = await model.create(data);
            const record = await model.findByPk(created.id, findOptions());
            res.status(201).json({ success: true, data: record });
        } catch (error) {
            handleError(res, error);
        }
    };

    const update = async (req, res) => {
        try {
            const record = await model.findByPk(req.params.id);
            if (!record) return res.status(404).json({ success: false, error: notFound });

            const data = pickFields(req.body, writable);
            if (slugFrom && (req.body.slug !== undefined || req.body[slugFrom] !== undefined)) {
                data.slug = await uniqueSlug(model, req.body.slug || req.body[slugFrom], record.id);
            }
            if (audit) data.updated_by = req.user?.id ?? null;

            await record.update(data);
            const fresh = await model.findByPk(record.id, findOptions());
            res.json({ success: true, data: fresh });
        } catch (error) {
            handleError(res, error);
        }
    };

    const remove = async (req, res) => {
        try {
            const record = await model.findByPk(req.params.id);
            if (!record) return res.status(404).json({ success: false, error: notFound });
            await record.destroy(); // soft delete when the model is paranoid
            res.json({ success: true, message: 'Deleted successfully' });
        } catch (error) {
            handleError(res, error);
        }
    };

    return { list, getById, create, update, remove };
};

// Toggle a status/publish enum column. Returns a handler.
//   setPublishState(Model, { field:'status', value:'Published', audit:true })
export const setStatusField = (model, { field, value, audit = false, notFound = 'Record not found' }) =>
    async (req, res) => {
        try {
            const record = await model.findByPk(req.params.id);
            if (!record) return res.status(404).json({ success: false, error: notFound });
            const patch = { [field]: value };
            if (audit) patch.updated_by = req.user?.id ?? null;
            await record.update(patch);
            res.json({ success: true, data: record });
        } catch (error) {
            handleError(res, error);
        }
    };
