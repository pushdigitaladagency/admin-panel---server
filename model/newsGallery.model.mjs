import { DataTypes } from 'sequelize';
import sequelize from '../config/db.mjs';

const NewsGallery = sequelize.define(
    'NewsGallery',
    {
        id: { type: DataTypes.BIGINT.UNSIGNED, primaryKey: true, autoIncrement: true },
        news_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
        image_path: { type: DataTypes.STRING(2048), allowNull: false },
        alt_text: { type: DataTypes.STRING(255) },
        caption: { type: DataTypes.TEXT },
        sort_order: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 }
    },
    {
        tableName: 'news_gallery',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: false
    }
);

export default NewsGallery;
