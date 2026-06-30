import { DataTypes } from 'sequelize';
import sequelize from '../config/db.mjs';

// Mirrors the live `investor_documents` table (investor relations PDFs/reports).
const InvestorDocument = sequelize.define(
    'InvestorDocument',
    {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        title: { type: DataTypes.STRING(255), allowNull: false },
        slug: { type: DataTypes.STRING(255), unique: true },
        category_id: { type: DataTypes.INTEGER, allowNull: false },
        financial_year: { type: DataTypes.STRING(20), allowNull: false },
        description: { type: DataTypes.TEXT },
        publish_date: { type: DataTypes.DATEONLY, allowNull: false },
        featured: { type: DataTypes.ENUM('Yes', 'No'), defaultValue: 'No' },
        display_order: { type: DataTypes.INTEGER, defaultValue: 0 },
        pdf_file: { type: DataTypes.STRING(500), allowNull: false },
        file_size: { type: DataTypes.BIGINT, defaultValue: 0 },
        download_count: { type: DataTypes.INTEGER, defaultValue: 0 },
        last_downloaded_date: { type: DataTypes.DATE },
        status: { type: DataTypes.ENUM('Draft', 'Published', 'Archived'), defaultValue: 'Draft' },
        meta_title: { type: DataTypes.STRING(255) },
        meta_keywords: { type: DataTypes.TEXT },
        meta_description: { type: DataTypes.TEXT },
        canonical_url: { type: DataTypes.STRING(255) },
        created_by: { type: DataTypes.INTEGER },
        updated_by: { type: DataTypes.INTEGER }
    },
    {
        tableName: 'investor_documents',
        timestamps: true,
        createdAt: 'created_date',
        updatedAt: 'updated_date'
    }
);

export default InvestorDocument;
