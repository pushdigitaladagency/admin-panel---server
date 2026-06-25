import { Op } from 'sequelize';
import { pickFields, handleError, uniqueSlug } from '../utils/helpers.mjs';
import { logAction } from '../utils/actionLogger.mjs';

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

            const pageParam = req.query.page;
            const limitParam = req.query.limit;

            const queryOptions = {
                ...findOptions(),
                where,
                order: defaultOrder,
                distinct: true
            };

            let page = 1;
            let limit = null;

            if (pageParam !== undefined || limitParam !== undefined) {
                page = Math.max(1, parseInt(pageParam, 10) || 1);
                limit = Math.min(1000, Math.max(1, parseInt(limitParam, 10) || 20));
                queryOptions.limit = limit;
                queryOptions.offset = (page - 1) * limit;
            }

            const { rows, count } = await model.findAndCountAll(queryOptions);

            res.json({
                success: true,
                data: rows,
                meta: {
                    total: count,
                    page,
                    limit: limit || count,
                    pages: limit ? Math.ceil(count / limit) : 1
                }
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
            
            // Log creation
            logAction(req, `Created ${model.name}`, model.name, created.id, data);
            
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
            
            // Log update
            logAction(req, `Updated ${model.name}`, model.name, record.id, data);
            
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
            
            // Log deletion
            logAction(req, `Deleted ${model.name}`, model.name, record.id);
            
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
