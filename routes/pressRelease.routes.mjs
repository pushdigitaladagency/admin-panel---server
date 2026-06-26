import express from 'express';
import {
    pressReleaseController as ctrl,
    pressReleaseCategoryController as cat,
    publish, unpublish
} from '../controller/pressReleaseController.mjs';
import requirePermission, { requirePublishToChangeStatus, requirePublishToSetStatus } from '../middleware/permission.mjs';
import { PressRelease } from '../model/index.mjs';

const router = express.Router();
const can = (action) => requirePermission('press_releases', action);

// Auth enforced globally in routes/index.js.
// Categories (governed by the press_releases module)
router.get('/press-release-categories', can('view'), cat.list);
router.get('/press-release-categories/:id', can('view'), cat.getById);
router.post('/press-release-categories', can('create'), cat.create);
router.put('/press-release-categories/:id', can('edit'), cat.update);
router.delete('/press-release-categories/:id', can('delete'), cat.remove);

// Press releases
router.get('/press-releases', can('view'), ctrl.list);
router.get('/press-releases/:id', can('view'), ctrl.getById);
router.post('/press-releases', can('create'), requirePublishToSetStatus('status', 'press_releases'), ctrl.create);
router.put('/press-releases/:id', can('edit'), requirePublishToChangeStatus(PressRelease, 'status', 'press_releases'), ctrl.update);
router.delete('/press-releases/:id', can('delete'), ctrl.remove);
router.patch('/press-releases/:id/publish', can('publish'), publish);
router.patch('/press-releases/:id/unpublish', can('publish'), unpublish);

export default router;
