import { DataTypes } from 'sequelize';
import sequelize from '../config/db.mjs';

// Mirrors the live `role_permissions` junction (composite PK, created_at only).
const RolePermission = sequelize.define(
    'RolePermission',
    {
        role_id: {
            type: DataTypes.BIGINT.UNSIGNED,
            primaryKey: true,
            allowNull: false
        },

        permission_id: {
            type: DataTypes.BIGINT.UNSIGNED,
            primaryKey: true,
            allowNull: false
        }
    },
    {
        tableName: 'role_permissions',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: false
    }
);

export default RolePermission;
