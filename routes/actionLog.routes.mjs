import express from 'express';
import { actionLogController } from '../controller/actionLogController.mjs';
import requirePermission from '../middleware/permission.mjs';

const router = express.Router();
const can = (action) => requirePermission('action_log', action);

router.get('/action-logs', can('view'), actionLogController.list);

export default router;
