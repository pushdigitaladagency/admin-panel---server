import { DataTypes } from 'sequelize';
import sequelize from '../config/db.mjs';

const GalleryCategory = sequelize.define(
    'GalleryCategory',
    {
        id: { type: DataTypes.BIGINT.UNSIGNED, primaryKey: true, autoIncrement: true },
        name: { type: DataTypes.STRING(100), allowNull: false },
        slug: { type: DataTypes.STRING(150), allowNull: false, unique: true },
        description: { type: DataTypes.TEXT },
        status: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true }
    },
    {
        tableName: 'gallery_categories',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
);

export default GalleryCategory;
