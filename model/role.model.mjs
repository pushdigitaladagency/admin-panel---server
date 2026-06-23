import { DataTypes } from 'sequelize';
import sequelize from '../config/db.mjs';

// Mirrors the live `roles` table (RBAC role definitions).
const Role = sequelize.define(
    'Role',
    {
        id: {
            type: DataTypes.BIGINT.UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },

        name: {
            type: DataTypes.STRING(100),
            allowNull: false
        },

        code: {
            type: DataTypes.STRING(60),
            unique: true,
            allowNull: false
        },

        description: {
            type: DataTypes.STRING(255)
        },

        status: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        }
    },
    {
        tableName: 'roles',
        timestamps: true,
        paranoid: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at'
    }
);

export default Role;
