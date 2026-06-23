import express from 'express';
import {
    eventController as ctrl,
    eventTypeController as type,
    publish, unpublish
} from '../controller/eventController.mjs';
import requirePermission from '../middleware/permission.mjs';

const router = express.Router();
const can = (action) => requirePermission('events', action);

// Auth enforced globally in routes/index.js.
// Event types
router.get('/event-types', can('view'), type.list);
router.get('/event-types/:id', can('view'), type.getById);
router.post('/event-types', can('create'), type.create);
router.put('/event-types/:id', can('edit'), type.update);
router.delete('/event-types/:id', can('delete'), type.remove);

// Events
router.get('/events', can('view'), ctrl.list);
router.get('/events/:id', can('view'), ctrl.getById);
router.post('/events', can('create'), ctrl.create);
router.put('/events/:id', can('edit'), ctrl.update);
router.delete('/events/:id', can('delete'), ctrl.remove);
router.patch('/events/:id/publish', can('publish'), publish);
router.patch('/events/:id/unpublish', can('publish'), unpublish);

export default router;
