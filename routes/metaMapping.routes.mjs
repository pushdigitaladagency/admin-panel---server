import express from 'express';
import { metaMappingController as ctrl } from '../controller/metaMappingController.mjs';
import requirePermission from '../middleware/permission.mjs';

const router = express.Router();
const can = (action) => requirePermission('meta_mappings', action);

router.get('/meta-mappings', can('view'), ctrl.list);
router.get('/meta-mappings/:id', can('view'), ctrl.getById);
router.post('/meta-mappings', can('create'), ctrl.create);
router.put('/meta-mappings/:id', can('edit'), ctrl.update);
router.delete('/meta-mappings/:id', can('delete'), ctrl.remove);

export default router;
