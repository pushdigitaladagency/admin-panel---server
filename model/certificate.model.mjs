import { DataTypes } from 'sequelize';
import sequelize from '../config/db.mjs';

// Mirrors the live `certificates` table (company certifications / accreditations).
const Certificate = sequelize.define(
    'Certificate',
    {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        certificate_title: { type: DataTypes.STRING(255), allowNull: false },
        slug: { type: DataTypes.STRING(255), unique: true },
        certificate_number: { type: DataTypes.STRING(150), allowNull: false },
        issuing_authority: { type: DataTypes.STRING(255), allowNull: false },
        issue_date: { type: DataTypes.DATEONLY, allowNull: false },
        expiry_date: { type: DataTypes.DATEONLY },
        description: { type: DataTypes.TEXT },
        display_order: { type: DataTypes.INTEGER, defaultValue: 0 },
        featured: { type: DataTypes.ENUM('Yes', 'No'), defaultValue: 'No' },
        certificate_image: { type: DataTypes.STRING(500), allowNull: false },
        pdf_attachment: { type: DataTypes.STRING(500) },
        thumbnail_image: { type: DataTypes.STRING(500) },
        alt_text: { type: DataTypes.STRING(255) },
        meta_title: { type: DataTypes.STRING(255) },
        meta_keywords: { type: DataTypes.TEXT },
        meta_description: { type: DataTypes.TEXT },
        canonical_url: { type: DataTypes.STRING(500) },
        status: { type: DataTypes.ENUM('Active', 'Inactive', 'Expired'), defaultValue: 'Active' },
        created_by: { type: DataTypes.INTEGER },
        updated_by: { type: DataTypes.INTEGER }
    },
    {
        tableName: 'certificates',
        timestamps: true,
        createdAt: 'created_date',
        updatedAt: 'updated_date'
    }
);

export default Certificate;
