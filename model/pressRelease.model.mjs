import { DataTypes } from 'sequelize';
import sequelize from '../config/db.mjs';

const PressRelease = sequelize.define(
    'PressRelease',
    {
        id: { type: DataTypes.BIGINT.UNSIGNED, primaryKey: true, autoIncrement: true },
        title: { type: DataTypes.STRING(255), allowNull: false },
        slug: { type: DataTypes.STRING(255), allowNull: false, unique: true },
        category_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
        short_description: { type: DataTypes.TEXT('long'), allowNull: false },
        detailed_content: { type: DataTypes.TEXT('long'), allowNull: false },
        featured_image: { type: DataTypes.STRING(500), allowNull: false },
        attachment: { type: DataTypes.STRING(500) },
        publish_date: { type: DataTypes.DATE, allowNull: false },
        expiry_date: { type: DataTypes.DATE },
        tags: { type: DataTypes.STRING(500) },
        featured: { type: DataTypes.ENUM('Yes', 'No'), allowNull: false, defaultValue: 'No' },
        seo_title: { type: DataTypes.STRING(255) },
        seo_keywords: { type: DataTypes.TEXT },
        seo_description: { type: DataTypes.TEXT },
        canonical_url: { type: DataTypes.STRING(500) },
        status: { type: DataTypes.ENUM('Draft', 'Published'), allowNull: false, defaultValue: 'Draft' },
        created_by: { type: DataTypes.BIGINT.UNSIGNED },
        updated_by: { type: DataTypes.BIGINT.UNSIGNED }
    },
    {
        tableName: 'press_releases',
        timestamps: true,
        paranoid: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at'
    }
);

export default PressRelease;
