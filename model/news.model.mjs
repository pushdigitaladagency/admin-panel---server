import { DataTypes } from 'sequelize';
import sequelize from '../config/db.mjs';

const News = sequelize.define(
    'News',
    {
        id: { type: DataTypes.BIGINT.UNSIGNED, primaryKey: true, autoIncrement: true },
        title: { type: DataTypes.STRING(255), allowNull: false },
        slug: { type: DataTypes.STRING(255), allowNull: false, unique: true },
        category_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
        summary: { type: DataTypes.TEXT, allowNull: false },
        full_content: { type: DataTypes.TEXT('long'), allowNull: false },
        featured_image: { type: DataTypes.STRING(500), allowNull: false },
        news_source: { type: DataTypes.STRING(255) },
        author: { type: DataTypes.STRING(150) },
        author_id: { type: DataTypes.BIGINT.UNSIGNED },
        publish_date: { type: DataTypes.DATE, allowNull: false },
        tags: { type: DataTypes.STRING(500) },
        featured: { type: DataTypes.ENUM('Yes', 'No'), allowNull: false, defaultValue: 'No' },
        seo_title: { type: DataTypes.STRING(255) },
        seo_keywords: { type: DataTypes.TEXT },
        seo_description: { type: DataTypes.TEXT },
        canonical_url: { type: DataTypes.STRING(500) },
        status: { type: DataTypes.ENUM('Draft', 'Published', 'Archived'), allowNull: false, defaultValue: 'Draft' },
        created_by: { type: DataTypes.BIGINT.UNSIGNED },
        updated_by: { type: DataTypes.BIGINT.UNSIGNED }
    },
    {
        tableName: 'news',
        timestamps: true,
        paranoid: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at'
    }
);

export default News;
