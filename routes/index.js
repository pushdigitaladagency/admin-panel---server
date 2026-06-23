import express from 'express';
import authMiddleware from '../middleware/auth.mjs';
import authRoutes from './authRoute.mjs';
import userRoutes from './user.routes.mjs';
import rbacRoutes from './rbac.routes.mjs';
import pressReleaseRoutes from './pressRelease.routes.mjs';
import newsRoutes from './news.routes.mjs';
import eventRoutes from './event.routes.mjs';
import galleryRoutes from './gallery.routes.mjs';
import enquiryRoutes from './enquiry.routes.mjs';
import uploadRoutes from './upload.routes.mjs';

const router = express.Router();

// --- Public + self-guarded routes (registered before the global auth guard) ---
router.use('/api', authRoutes);     // POST /login (public), GET /me (self-guarded)
router.use('/api', enquiryRoutes);  // POST /contact (public) + /enquiries (self-guarded)
router.use('/api', uploadRoutes);   // upload endpoints (self-guarded)

// --- Everything below requires a valid token ---
router.use('/api', authMiddleware);
router.use('/api', userRoutes);
router.use('/api', rbacRoutes);
router.use('/api', pressReleaseRoutes);
router.use('/api', newsRoutes);
router.use('/api', eventRoutes);
router.use('/api', galleryRoutes);

export default router;
