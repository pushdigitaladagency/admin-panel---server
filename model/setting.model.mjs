import { DataTypes } from 'sequelize';
import sequelize from '../config/db.mjs';

const Setting = sequelize.define(
    'Setting',
    {
        id: {
            type: DataTypes.BIGINT.UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },
        site_name: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        site_description: {
            type: DataTypes.STRING(255)
        },
        contact_email: {
            type: DataTypes.STRING(150)
        },
        seo_default_title: {
            type: DataTypes.STRING(150)
        },
        seo_default_description: {
            type: DataTypes.TEXT
        }
    },
    {
        tableName: 'settings',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
);

export default Setting;
