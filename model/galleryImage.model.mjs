import { DataTypes } from 'sequelize';
import sequelize from '../config/db.mjs';

const GalleryImage = sequelize.define(
    'GalleryImage',
    {
        id: { type: DataTypes.BIGINT.UNSIGNED, primaryKey: true, autoIncrement: true },
        album_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
        image_path: { type: DataTypes.STRING(500), allowNull: false },
        image_title: { type: DataTypes.STRING(255) },
        caption: { type: DataTypes.TEXT },
        alt_text: { type: DataTypes.STRING(255) },
        display_order: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
        status: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true }
    },
    {
        tableName: 'gallery_images',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
);

export default GalleryImage;
