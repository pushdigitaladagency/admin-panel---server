import { DataTypes } from 'sequelize';
import sequelize from '../config/db.mjs';

const GalleryAlbum = sequelize.define(
    'GalleryAlbum',
    {
        id: { type: DataTypes.BIGINT.UNSIGNED, primaryKey: true, autoIncrement: true },
        title: { type: DataTypes.STRING(255), allowNull: false },
        category_id: { type: DataTypes.BIGINT.UNSIGNED },
        description: { type: DataTypes.TEXT },
        cover_image: { type: DataTypes.STRING(500), allowNull: false },
        event_id: { type: DataTypes.BIGINT.UNSIGNED },
        status: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
        created_by: { type: DataTypes.BIGINT.UNSIGNED },
        updated_by: { type: DataTypes.BIGINT.UNSIGNED }
    },
    {
        tableName: 'gallery_albums',
        timestamps: true,
        paranoid: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at'
    }
);

export default GalleryAlbum;
