import express from 'express';
import { getSettings, updateSettings } from '../controller/settingController.mjs';
import requirePermission from '../middleware/permission.mjs';

const router = express.Router();
const can = (action) => requirePermission('settings', action);

router.get('/settings', can('view'), getSettings);
router.put('/settings', can('edit'), updateSettings);

export default router;
