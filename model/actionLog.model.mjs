import { DataTypes } from 'sequelize';
import sequelize from '../config/db.mjs';

const ActionLog = sequelize.define(
    'ActionLog',
    {
        id: {
            type: DataTypes.BIGINT.UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },
        action: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        model: {
            type: DataTypes.STRING(50)
        },
        record_id: {
            type: DataTypes.BIGINT.UNSIGNED
        },
        user_id: {
            type: DataTypes.BIGINT.UNSIGNED
        },
        username: {
            type: DataTypes.STRING(100)
        },
        ip_address: {
            type: DataTypes.STRING(45)
        },
        details: {
            type: DataTypes.TEXT
        }
    },
    {
        tableName: 'action_logs',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: false
    }
);

export default ActionLog;
