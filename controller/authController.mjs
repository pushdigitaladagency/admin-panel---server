import { User, Role, Permission, Module } from "../model/index.mjs";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const authController = async (req, res) => {
    const { email, password_hash } = req.body;

    try {
        if (!email || !password_hash) {
            return res.status(400).json({ success: false, error: 'Email and password are required' });
        }

        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password_hash, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ success: false, error: 'Invalid credentials' });
        }

        // Reject deactivated accounts (checked after password so account status
        // isn't revealed to anyone without valid credentials).
        if (!user.status) {
            return res.status(403).json({ success: false, error: 'Account is inactive' });
        }

        // Record the login without bumping updated_at (silent).
        await user.update({ last_login_at: new Date() }, { silent: true });

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role_id },
            process.env.JWT_SECRET,
            { expiresIn: '8h' }
        );

        res.json({ success: true, token });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// GET /api/me — current user, role, and granted permission codes ("module:action").
// Drives menu/button visibility on the client.
export const getMe = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: { exclude: ['password_hash'] },
            include: [{
                model: Role,
                as: 'role',
                include: [{
                    model: Permission,
                    as: 'permissions',
                    attributes: ['action'],
                    through: { attributes: [] },
                    include: [{ model: Module, as: 'module', attributes: ['code'] }]
                }]
            }]
        });

        if (!user) return res.status(404).json({ success: false, error: 'User not found' });

        const permissions = (user.role?.permissions || []).map((p) => `${p.module.code}:${p.action}`);
        const data = { ...user.toJSON(), permissions };
        delete data.role?.permissions; // keep the payload lean; codes are flattened above
        res.json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
