import { DataTypes } from 'sequelize';
import sequelize from '../config/db.mjs';

const GalleryVideo = sequelize.define(
    'GalleryVideo',
    {
        id: { type: DataTypes.BIGINT.UNSIGNED, primaryKey: true, autoIncrement: true },
        title: { type: DataTypes.STRING(255), allowNull: false },
        video_url: { type: DataTypes.STRING(500), allowNull: false },
        thumbnail_image: { type: DataTypes.STRING(500) },
        description: { type: DataTypes.TEXT },
        status: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true }
    },
    {
        tableName: 'gallery_videos',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
);

export default GalleryVideo;
