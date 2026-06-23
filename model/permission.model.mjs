import { DataTypes } from 'sequelize';
import sequelize from '../config/db.mjs';

// Mirrors the live `permissions` table (one row per module + action).
// Schema has created_at but no updated_at / deleted_at.
const Permission = sequelize.define(
    'Permission',
    {
        id: {
            type: DataTypes.BIGINT.UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },

        module_id: {
            type: DataTypes.BIGINT.UNSIGNED,
            allowNull: false
        },

        name: {
            type: DataTypes.STRING(100),
            allowNull: false
        },

        code: {
            type: DataTypes.STRING(120),
            unique: true,
            allowNull: false
        },

        action: {
            type: DataTypes.ENUM('view', 'create', 'edit', 'delete', 'publish'),
            allowNull: false
        },

        description: {
            type: DataTypes.STRING(255)
        }
    },
    {
        tableName: 'permissions',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: false
    }
);

export default Permission;
