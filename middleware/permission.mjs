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
                error: `Forbidden: missing '${action}' permission on '${moduleCode}'`
            });
        }

        next();
    } catch (error) {
        return res.status(500).json({ success: false, error: 'Permission check failed' });
    }
};

export default requirePermission;
