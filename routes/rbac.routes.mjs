import express from 'express';
import { roleController, listModules, permissionController } from '../controller/roleController.mjs';
import requirePermission from '../middleware/permission.mjs';

const router = express.Router();
const can = (action) => requirePermission('roles', action);

// Auth is enforced globally in routes/index.js; these routes add the
// 'roles' module permission checks on top.

// Roles
router.get('/roles', can('view'), roleController.list);
router.get('/roles/:id', can('view'), roleController.getById);
router.post('/roles', can('create'), roleController.create);
router.put('/roles/:id', can('edit'), roleController.update);
router.delete('/roles/:id', can('delete'), roleController.remove);

// Role <-> permission grants (the permission matrix)
router.get('/roles/:id/permissions', can('view'), roleController.getRolePermissions);
router.put('/roles/:id/permissions', can('edit'), roleController.setRolePermissions);

// Modules (matrix layout) + permission catalogue
router.get('/modules', can('view'), listModules);
router.get('/permissions', can('view'), permissionController.list);
router.get('/permissions/:id', can('view'), permissionController.getById);
router.post('/permissions', can('create'), permissionController.create);
router.put('/permissions/:id', can('edit'), permissionController.update);
router.delete('/permissions/:id', can('delete'), permissionController.remove);

export default router;
