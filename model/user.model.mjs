import { DataTypes } from 'sequelize';
import sequelize from '../config/db.mjs';

// Mirrors the live `users` table:
//   - last_name / mobile_number are nullable (optional in the spec form)
//   - audit columns (created_by, updated_by) + managed timestamps
//   - soft delete via deleted_at (paranoid)
const User = sequelize.define(
    'User',
    {
        id: {
            type: DataTypes.BIGINT.UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },

        first_name: {
            type: DataTypes.STRING(80),
            allowNull: false
        },

        last_name: {
            type: DataTypes.STRING(80),
            allowNull: true
        },

        username: {
            type: DataTypes.STRING(60),
            unique: true,
            allowNull: false
        },

        email: {
            type: DataTypes.STRING(150),
            unique: true,
            allowNull: false,
            validate: {
                isEmail: true
            }
        },

        mobile_number: {
            type: DataTypes.STRING(20),
            allowNull: true
        },

        password_hash: {
            type: DataTypes.STRING(255),
            allowNull: false
        },

        role_id: {
            type: DataTypes.BIGINT.UNSIGNED,
            allowNull: false
        },

        profile_image: {
            type: DataTypes.STRING(255)
        },

        status: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },

        notes: {
            type: DataTypes.TEXT
        },

        last_login_at: {
            type: DataTypes.DATE
        },

        created_by: {
            type: DataTypes.BIGINT.UNSIGNED,
            allowNull: true
        },

        updated_by: {
            type: DataTypes.BIGINT.UNSIGNED,
            allowNull: true
        }
    },
    {
        tableName: 'users',
        timestamps: true,
        paranoid: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at'
    }
);

export default User;
