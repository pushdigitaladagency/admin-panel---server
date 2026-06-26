import { Permission, Module, Role } from '../model/index.mjs';

// RBAC gate. Returns middleware that allows the request through only if the
// authenticated user's role has been granted `action` on `moduleCode`.
//
// Usage:  router.post('/users', auth, requirePermission('users', 'create'), createUser)
//
// The check resolves the full chain in one query:
//   role -> role_permissions -> permissions (action) -> modules (code)
// Super Admin / Admin pass naturally because they are granted every permission.
const requirePermission = (moduleCode, action) => async (req, res, next) => {
    try {
        const roleId = req.user?.role;
        if (!roleId) {
            return res.status(401).json({ success: false, error: 'Not authenticated' });
        }

        const granted = await Permission.count({
            where: { action },
            include: [
                { model: Module, as: 'module', where: { code: moduleCode }, required: true },
                { model: Role, as: 'roles', where: { id: roleId }, required: true, through: { attributes: [] } }
            ]
        });

        if (granted === 0) {
            return res.status(403).json({
                success: false,
                error: 'You do not have access to perform this action'
            });
        }

        next();
    } catch (error) {
        return res.status(500).json({ success: false, error: 'Permission check failed' });
    }
};

// Publish-state is a writable field on the generic create/edit routes (guarded only
// by 'create'/'edit'), so without these guards an edit-only user could publish by
// simply editing. These enforce the 'publish' permission whenever the status field
// is actually being changed, no matter which endpoint sets it.

// For UPDATE (PUT): require 'publish' only if the incoming status differs from the
// stored value — plain edits that leave the status alone still need only 'edit'.
export const requirePublishToChangeStatus = (Model, statusField, moduleCode) => async (req, res, next) => {
    try {
        const incoming = req.body[statusField];
        if (incoming === undefined) return next();
        const record = await Model.findByPk(req.params.id, { attributes: ['id', statusField] });
        if (!record) return next(); // let the controller return its 404
        if (String(record[statusField]) === String(incoming)) return next(); // unchanged
        return requirePermission(moduleCode, 'publish')(req, res, next);
    } catch (error) {
        return res.status(500).json({ success: false, error: 'Permission check failed' });
    }
};

// For CREATE (POST): require 'publish' if the new record is given a non-default
// (e.g. 'Published') status. Creating a Draft needs only 'create'.
export const requirePublishToSetStatus = (statusField, moduleCode, defaultValue = 'Draft') => (req, res, next) => {
    const incoming = req.body[statusField];
    if (incoming === undefined || String(incoming) === String(defaultValue)) return next();
    return requirePermission(moduleCode, 'publish')(req, res, next);
};

export default requirePermission;
