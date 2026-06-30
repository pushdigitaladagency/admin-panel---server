import express from 'express';
import {
    certificateController as ctrl,
    activateCertificate, deactivateCertificate
} from '../controller/certificateController.mjs';
import requirePermission from '../middleware/permission.mjs';

const router = express.Router();
const can = (action) => requirePermission('certificates', action);

router.get('/certificates', can('view'), ctrl.list);
router.get('/certificates/:id', can('view'), ctrl.getById);
router.post('/certificates', can('create'), ctrl.create);
router.put('/certificates/:id', can('edit'), ctrl.update);
router.delete('/certificates/:id', can('delete'), ctrl.remove);
router.patch('/certificates/:id/activate', can('edit'), activateCertificate);
router.patch('/certificates/:id/deactivate', can('edit'), deactivateCertificate);

export default router;
