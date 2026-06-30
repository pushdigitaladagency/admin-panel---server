import express from 'express';
import {
    careerPostController as post,
    careerApplicationController as app,
    publishCareerPost, unpublishCareerPost, closeCareerPost
} from '../controller/careerController.mjs';
import requirePermission, { requirePublishToChangeStatus, requirePublishToSetStatus } from '../middleware/permission.mjs';
import { CareerPost } from '../model/index.mjs';

const router = express.Router();
// Career posts and career applications are governed by separate modules.
const canPost = (action) => requirePermission('career_posts', action);
const canApp = (action) => requirePermission('career_applications', action);

// Auth enforced globally in routes/index.js.

// --- Career posts (job openings) ---
router.get('/career-posts', canPost('view'), post.list);
router.get('/career-posts/:id', canPost('view'), post.getById);
router.post('/career-posts', canPost('create'), requirePublishToSetStatus('status', 'career_posts'), post.create);
router.put('/career-posts/:id', canPost('edit'), requirePublishToChangeStatus(CareerPost, 'status', 'career_posts'), post.update);
router.delete('/career-posts/:id', canPost('delete'), post.remove);
router.patch('/career-posts/:id/publish', canPost('publish'), publishCareerPost);
router.patch('/career-posts/:id/unpublish', canPost('publish'), unpublishCareerPost);
router.patch('/career-posts/:id/close', canPost('publish'), closeCareerPost);

// --- Career applications (candidate enquiries, admin workflow) ---
router.get('/career-applications', canApp('view'), app.list);
router.get('/career-applications/:id', canApp('view'), app.getById);
router.post('/career-applications', canApp('create'), app.create);
router.put('/career-applications/:id', canApp('edit'), app.update);
router.delete('/career-applications/:id', canApp('delete'), app.remove);

export default router;
