import express from 'express';
import { getGlobalSettings, updateGlobalSettings } from '../controller/globalSettingController.mjs';
import requirePermission from '../middleware/permission.mjs';

const router = express.Router();
const can = (action) => requirePermission('global_settings', action);

router.get('/global-settings', can('view'), getGlobalSettings);
router.put('/global-settings', can('edit'), updateGlobalSettings);

export default router;
