import { Enquiry, User } from '../model/index.mjs';
import { handleError, referenceNo, pickFields } from '../utils/helpers.mjs';
import { logAction } from '../utils/actionLogger.mjs';

const ASSIGNEE = { model: User, as: 'assignee', attributes: ['id', 'first_name', 'last_name'] };
const RESPONDER = { model: User, as: 'responder', attributes: ['id', 'first_name', 'last_name'] };

const WORKFLOW_FIELDS = ['assigned_to', 'follow_up_notes', 'response_date', 'responded_by', 'status', 'attachment'];

// POST /api/contact  (PUBLIC — website contact form, no auth)
export const submitEnquiry = async (req, res) => {
    try {
        const { name, email, mobile, subject, message, attachment } = req.body;
        if (!name || !email || !mobile || !subject || !message) {
            return res.status(400).json({ success: false, error: 'name, email, mobile, subject and message are required' });
        }

        // Generate a unique reference; retry a couple of times on the rare collision.
        let enquiry;
        for (let attempt = 0; attempt < 3; attempt += 1) {
            try {
                enquiry = await Enquiry.create({
                    reference_no: referenceNo(),
                    name, email, mobile, subject, message, attachment,
                    status: 'New'
                });
                break;
            } catch (e) {
                if (e.name === 'SequelizeUniqueConstraintError' && attempt < 2) continue;
                throw e;
            }
        }

        res.status(201).json({ success: true, data: { id: enquiry.id, reference_no: enquiry.reference_no } });
    } catch (error) {
        handleError(res, error);
    }
};

// GET /api/enquiries  (admin)
export const listEnquiries = async (req, res) => {
    try {
        const where = {};
        if (req.query.status) where.status = req.query.status;

        const pageParam = req.query.page;
        const limitParam = req.query.limit;

        const queryOptions = {
            where,
            include: [ASSIGNEE, RESPONDER],
            order: [['created_at', 'DESC']],
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

        const { rows, count } = await Enquiry.findAndCountAll(queryOptions);

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

// GET /api/enquiries/:id  (admin)
export const getEnquiry = async (req, res) => {
    try {
        const enquiry = await Enquiry.findByPk(req.params.id, { include: [ASSIGNEE, RESPONDER] });
        if (!enquiry) return res.status(404).json({ success: false, error: 'Enquiry not found' });
        res.json({ success: true, data: enquiry });
    } catch (error) {
        handleError(res, error);
    }
};

// PUT /api/enquiries/:id  (admin workflow: assign, notes, status)
export const updateEnquiry = async (req, res) => {
    try {
        const enquiry = await Enquiry.findByPk(req.params.id);
        if (!enquiry) return res.status(404).json({ success: false, error: 'Enquiry not found' });

        const updates = pickFields(req.body, WORKFLOW_FIELDS);

        // When marked Responded, stamp who/when if not explicitly supplied.
        if (updates.status === 'Responded') {
            if (updates.responded_by === undefined) updates.responded_by = req.user?.id ?? null;
            if (updates.response_date === undefined) updates.response_date = new Date();
        }

        await enquiry.update(updates);
        const fresh = await Enquiry.findByPk(enquiry.id, { include: [ASSIGNEE, RESPONDER] });
        
        // Log action
        logAction(req, 'Updated Enquiry', 'Enquiry', enquiry.id, updates);
        
        res.json({ success: true, data: fresh });
    } catch (error) {
        handleError(res, error);
    }
};

// DELETE /api/enquiries/:id  (admin)
export const removeEnquiry = async (req, res) => {
    try {
        const enquiry = await Enquiry.findByPk(req.params.id);
        if (!enquiry) return res.status(404).json({ success: false, error: 'Enquiry not found' });
        await enquiry.destroy();
        
        // Log action
        logAction(req, 'Deleted Enquiry', 'Enquiry', enquiry.id);
        
        res.json({ success: true, message: 'Enquiry deleted' });
    } catch (error) {
        handleError(res, error);
    }
};
