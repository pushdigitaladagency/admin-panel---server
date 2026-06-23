import { DataTypes } from 'sequelize';
import sequelize from '../config/db.mjs';

const EventType = sequelize.define(
    'EventType',
    {
        id: { type: DataTypes.BIGINT.UNSIGNED, primaryKey: true, autoIncrement: true },
        name: { type: DataTypes.STRING(100), allowNull: false, unique: true },
        status: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true }
    },
    {
        tableName: 'event_types',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: false
    }
);

export default EventType;
