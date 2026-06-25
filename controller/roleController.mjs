import { fn, col } from 'sequelize';
import { Role, User, Permission, Module, RolePermission, sequelize } from '../model/index.mjs';
import { crudController } from './crudFactory.mjs';
import { handleError } from '../utils/helpers.mjs';
import { logAction } from '../utils/actionLogger.mjs';

const base = crudController(Role, {
    writable: ['name', 'code', 'description', 'status'],
    searchFields: ['name', 'code'],
    defaultOrder: [['id', 'ASC']],
    notFound: 'Role not found'
});

// List roles with a derived user count (spec: Role List shows User Count).
const list = async (req, res) => {
    try {
        const roles = await Role.findAll({ order: [['id', 'ASC']] });
        const counts = await User.findAll({
            attributes: ['role_id', [fn('COUNT', col('id')), 'cnt']],
            group: ['role_id'],
            raw: true
        });
        const byRole = Object.fromEntries(counts.map((c) => [String(c.role_id), Number(c.cnt)]));
        const data = roles.map((r) => ({ ...r.toJSON(), userCount: byRole[String(r.id)] || 0 }));
        res.json({ success: true, data });
    } catch (error) {
        handleError(res, error);
    }
};

// Permission IDs currently granted to a role.
const getRolePermissions = async (req, res) => {
    try {
        const role = await Role.findByPk(req.params.id);
        if (!role) return res.status(404).json({ success: false, error: 'Role not found' });
        const grants = await RolePermission.findAll({ where: { role_id: role.id }, attributes: ['permission_id'], raw: true });
        res.json({ success: true, data: grants.map((g) => Number(g.permission_id)) });
    } catch (error) {
        handleError(res, error);
    }
};

// Replace the full set of permissions granted to a role (the permission matrix save).
const setRolePermissions = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const role = await Role.findByPk(req.params.id, { transaction: t });
        if (!role) {
            await t.rollback();
            return res.status(404).json({ success: false, error: 'Role not found' });
        }

        const ids = Array.isArray(req.body.permissionIds) ? [...new Set(req.body.permissionIds.map(Number))] : [];
        // Validate the ids actually exist to avoid orphan grants.
        const valid = ids.length
            ? (await Permission.findAll({ where: { id: ids }, attributes: ['id'], transaction: t })).map((p) => Number(p.id))
            : [];

        await RolePermission.destroy({ where: { role_id: role.id }, transaction: t });
        if (valid.length) {
            await RolePermission.bulkCreate(valid.map((pid) => ({ role_id: role.id, permission_id: pid })), { transaction: t });
        }
        await t.commit();
        
        // Log action
        logAction(req, 'Updated Role Permissions', 'Role', role.id, { permissionIds: valid });
        
        res.json({ success: true, data: valid });
    } catch (error) {
        await t.rollback();
        handleError(res, error);
    }
};

export const roleController = { ...base, list, getRolePermissions, setRolePermissions };

// --- Permissions & Modules (read for the matrix UI + permission CRUD) ---

export const listModules = async (req, res) => {
    try {
        const modules = await Module.findAll({
            order: [['sort_order', 'ASC'], ['id', 'ASC']],
            include: [{ model: Permission, as: 'permissions', attributes: ['id', 'name', 'code', 'action'] }]
        });
        res.json({ success: true, data: modules });
    } catch (error) {
        handleError(res, error);
    }
};

export const permissionController = crudController(Permission, {
    include: [{ model: Module, as: 'module', attributes: ['id', 'name', 'code'] }],
    writable: ['module_id', 'name', 'code', 'action', 'description'],
    searchFields: ['name', 'code'],
    defaultOrder: [['module_id', 'ASC'], ['id', 'ASC']],
    notFound: 'Permission not found'
});
