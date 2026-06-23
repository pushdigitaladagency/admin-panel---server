import { DataTypes } from 'sequelize';
import sequelize from '../config/db.mjs';

const PressReleaseCategory = sequelize.define(
    'PressReleaseCategory',
    {
        id: { type: DataTypes.BIGINT.UNSIGNED, primaryKey: true, autoIncrement: true },
        name: { type: DataTypes.STRING(150), allowNull: false },
        slug: { type: DataTypes.STRING(200), allowNull: false, unique: true },
        description: { type: DataTypes.TEXT },
        status: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true }
    },
    {
        tableName: 'press_release_categories',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
);

export default PressReleaseCategory;
