import express from 'express';
import { getAllUsers, getUserById, createUser, updateUser, deleteUser } from '../controller/userController.mjs';
import requirePermission from '../middleware/permission.mjs';

const router = express.Router();
const can = (action) => requirePermission('users', action);

// Auth enforced globally in routes/index.js; these add the 'users' permission checks.
router.get('/users', can('view'), getAllUsers);
router.get('/users/:id', can('view'), getUserById);
router.post('/users', can('create'), createUser);
router.put('/users/:id', can('edit'), updateUser);
router.delete('/users/:id', can('delete'), deleteUser);

export default router;
