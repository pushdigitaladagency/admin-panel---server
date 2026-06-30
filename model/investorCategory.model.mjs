import { DataTypes } from 'sequelize';
import sequelize from '../config/db.mjs';

// Mirrors the live `investor_categories` table (groups investor documents).
const InvestorCategory = sequelize.define(
    'InvestorCategory',
    {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        category_name: { type: DataTypes.STRING(255), allowNull: false },
        slug: { type: DataTypes.STRING(255), unique: true },
        description: { type: DataTypes.TEXT },
        display_order: { type: DataTypes.INTEGER, defaultValue: 0 },
        status: { type: DataTypes.ENUM('Active', 'Inactive'), defaultValue: 'Active' },
        meta_title: { type: DataTypes.STRING(255) },
        meta_keywords: { type: DataTypes.TEXT },
        meta_description: { type: DataTypes.TEXT },
        canonical_url: { type: DataTypes.STRING(255) },
        created_by: { type: DataTypes.INTEGER },
        updated_by: { type: DataTypes.INTEGER }
    },
    {
        tableName: 'investor_categories',
        timestamps: true,
        createdAt: 'created_date',
        updatedAt: 'updated_date'
    }
);

export default InvestorCategory;
