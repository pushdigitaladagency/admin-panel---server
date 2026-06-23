import express from 'express';
import {
    submitEnquiry, listEnquiries, getEnquiry, updateEnquiry, removeEnquiry
} from '../controller/enquiryController.mjs';
import authMiddleware from '../middleware/auth.mjs';
import requirePermission from '../middleware/permission.mjs';

const router = express.Router();
const can = (action) => requirePermission('enquiries', action);

// PUBLIC — website contact form (no auth). Mounted before the auth guard.
router.post('/contact', submitEnquiry);

// Admin workflow (auth + 'enquiries' permissions). Note: no 'create' — enquiries
// originate from the public form only, matching the seeded permission matrix.
router.get('/enquiries', authMiddleware, can('view'), listEnquiries);
router.get('/enquiries/:id', authMiddleware, can('view'), getEnquiry);
router.put('/enquiries/:id', authMiddleware, can('edit'), updateEnquiry);
router.delete('/enquiries/:id', authMiddleware, can('delete'), removeEnquiry);

export default router;
