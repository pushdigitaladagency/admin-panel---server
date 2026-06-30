import { DataTypes } from 'sequelize';
import sequelize from '../config/db.mjs';

// Mirrors the live `meta_mappings` table (per-URL SEO / OpenGraph / Twitter metadata).
const MetaMapping = sequelize.define(
    'MetaMapping',
    {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        page_name: { type: DataTypes.STRING(255), allowNull: false },
        url: { type: DataTypes.STRING(500), allowNull: false, unique: true },
        meta_title: { type: DataTypes.STRING(255), allowNull: false },
        meta_keywords: { type: DataTypes.TEXT },
        meta_description: { type: DataTypes.TEXT, allowNull: false },
        canonical_url: { type: DataTypes.STRING(500) },
        og_title: { type: DataTypes.STRING(255) },
        og_description: { type: DataTypes.TEXT },
        og_image: { type: DataTypes.STRING(500) },
        og_type: { type: DataTypes.STRING(100), defaultValue: 'website' },
        og_url: { type: DataTypes.STRING(500) },
        twitter_card: { type: DataTypes.ENUM('Summary', 'Summary Large Image'), defaultValue: 'Summary' },
        twitter_title: { type: DataTypes.STRING(255) },
        twitter_description: { type: DataTypes.TEXT },
        twitter_image: { type: DataTypes.STRING(500) },
        robots: { type: DataTypes.ENUM('index, follow', 'noindex, nofollow'), defaultValue: 'index, follow' },
        schema_markup: { type: DataTypes.TEXT('long') },
        header_scripts: { type: DataTypes.TEXT('long') },
        footer_scripts: { type: DataTypes.TEXT('long') },
        status: { type: DataTypes.ENUM('Active', 'Inactive'), defaultValue: 'Active' },
        created_by: { type: DataTypes.INTEGER },
        updated_by: { type: DataTypes.INTEGER }
    },
    {
        tableName: 'meta_mappings',
        timestamps: true,
        createdAt: 'created_date',
        updatedAt: 'updated_date'
    }
);

export default MetaMapping;
