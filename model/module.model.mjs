import { DataTypes } from 'sequelize';
import sequelize from '../config/db.mjs';

// Mirrors the live `modules` table (CMS functional areas).
// No deleted_at column in the schema, so this model is not paranoid.
const Module = sequelize.define(
    'Module',
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

        sort_order: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },

        status: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        }
    },
    {
        tableName: 'modules',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
);

export default Module;
