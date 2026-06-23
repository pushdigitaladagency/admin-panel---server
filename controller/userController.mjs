import { User, Role } from '../model/index.mjs';
import bcrypt from 'bcrypt';

// Never expose the password hash in API responses.
const PUBLIC_ATTRIBUTES = { exclude: ['password_hash'] };

// Always return the role alongside the user (the list/detail screens show it).
const WITH_ROLE = { model: Role, as: 'role', attributes: ['id', 'name', 'code'] };

// Fields a client is allowed to set/update. Keeps id, audit columns, timestamps,
// and password_hash server-controlled. Password is handled separately (hashed).
const UPDATABLE_FIELDS = [
    'first_name',
    'last_name',
    'username',
    'email',
    'mobile_number',
    'password_hash',  // virtual field for incoming plaintext password
    'role_id',
    'profile_image',
    'status',
    'notes'
];

// Pick only whitelisted keys that are actually present in the body.
const pickFields = (body, fields) =>
    fields.reduce((acc, key) => {
        if (body[key] !== undefined) acc[key] = body[key];
        return acc;
    }, {});

// Map Sequelize errors to appropriate HTTP status codes.
const handleError = (res, error) => {
    if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(409).json({
            success: false,
            error: error.errors?.map((e) => e.message).join(', ') || 'Duplicate value'
        });
    }
    if (error.name === 'SequelizeValidationError') {
        return res.status(400).json({
            success: false,
            error: error.errors?.map((e) => e.message).join(', ') || 'Validation error'
        });
    }
    return res.status(500).json({ success: false, error: 'Internal server error' });
};

// GET /api/users
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({ attributes: PUBLIC_ATTRIBUTES, include: [WITH_ROLE] });
        res.json({ success: true, data: users });
    } catch (error) {
        handleError(res, error);
    }
};

// GET /api/users/:id
export const getUserById = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id, { attributes: PUBLIC_ATTRIBUTES, include: [WITH_ROLE] });
        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }
        res.json({ success: true, data: user });
    } catch (error) {
        handleError(res, error);
    }
};

// POST /api/users
export const createUser = async (req, res) => {
    try {
        const { password_hash } = req.body;
        if (!password_hash || typeof password_hash !== 'string') {
            return res.status(400).json({ success: false, error: 'Password is required' });
        }

        const data = pickFields(req.body, UPDATABLE_FIELDS);
        data.password_hash = await bcrypt.hash(password_hash, 10);
        data.created_by = req.user?.id ?? null;

        const newUser = await User.create(data);

        // Re-fetch without the password hash for the response.
        const safeUser = await User.findByPk(newUser.id, { attributes: PUBLIC_ATTRIBUTES, include: [WITH_ROLE] });
        res.status(201).json({ success: true, data: safeUser });
    } catch (error) {
        handleError(res, error);
    }
};

// PUT /api/users/:id
export const updateUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        const updates = pickFields(req.body, UPDATABLE_FIELDS);
        updates.updated_by = req.user?.id ?? null;

        // If a new password is provided, hash it before saving.
        if (req.body.password_hash) {
            updates.password_hash = await bcrypt.hash(req.body.password_hash, 10);
        }

        await user.update(updates);

        const safeUser = await User.findByPk(user.id, { attributes: PUBLIC_ATTRIBUTES, include: [WITH_ROLE] });
        res.json({ success: true, data: safeUser });
    } catch (error) {
        handleError(res, error);
    }
};

// DELETE /api/users/:id  (soft delete via paranoid model)
export const deleteUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }
        await user.destroy();
        res.json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
        handleError(res, error);
    }
};
