import { DataTypes } from 'sequelize';
import sequelize from '../config/db.mjs';

// Unified enquiries table: public website fields + admin workflow fields.
const Enquiry = sequelize.define(
    'Enquiry',
    {
        id: { type: DataTypes.BIGINT.UNSIGNED, primaryKey: true, autoIncrement: true },
        reference_no: { type: DataTypes.STRING(40), allowNull: false, unique: true },
        name: { type: DataTypes.STRING(120), allowNull: false },
        email: { type: DataTypes.STRING(150), allowNull: false, validate: { isEmail: true } },
        mobile: { type: DataTypes.STRING(20), allowNull: false },
        subject: { type: DataTypes.STRING(200), allowNull: false },
        message: { type: DataTypes.TEXT, allowNull: false },
        attachment: { type: DataTypes.STRING(500) },
        assigned_to: { type: DataTypes.BIGINT.UNSIGNED },
        follow_up_notes: { type: DataTypes.TEXT },
        response_date: { type: DataTypes.DATE },
        responded_by: { type: DataTypes.BIGINT.UNSIGNED },
        status: { type: DataTypes.ENUM('New', 'In Progress', 'Responded', 'Closed'), allowNull: false, defaultValue: 'New' }
    },
    {
        tableName: 'enquiries',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
);

export default Enquiry;
