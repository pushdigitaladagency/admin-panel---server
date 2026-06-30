import { DataTypes } from 'sequelize';
import sequelize from '../config/db.mjs';

// Mirrors the live `career_applications` table (candidate submissions + admin workflow).
// `applied_date` is a plain column; created_date/updated_date are the managed timestamps.
const CareerApplication = sequelize.define(
    'CareerApplication',
    {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        full_name: { type: DataTypes.STRING(255), allowNull: false },
        email: { type: DataTypes.STRING(255), allowNull: false, validate: { isEmail: true } },
        mobile_number: { type: DataTypes.STRING(20), allowNull: false },
        date_of_birth: { type: DataTypes.DATEONLY },
        gender: { type: DataTypes.ENUM('Male', 'Female', 'Other') },
        current_location: { type: DataTypes.STRING(255) },
        linkedin_profile: { type: DataTypes.STRING(500) },
        portfolio_website: { type: DataTypes.STRING(500) },
        resume_cv: { type: DataTypes.STRING(500), allowNull: false },
        cover_letter: { type: DataTypes.TEXT },
        cover_letter_attachment: { type: DataTypes.STRING(500) },
        applied_position: { type: DataTypes.STRING(255), allowNull: false },
        department: { type: DataTypes.STRING(150) },
        job_code: { type: DataTypes.STRING(100) },
        preferred_location: { type: DataTypes.STRING(255) },
        total_experience: { type: DataTypes.DECIMAL(4, 1), allowNull: false },
        current_company: { type: DataTypes.STRING(255) },
        current_designation: { type: DataTypes.STRING(255) },
        current_ctc: { type: DataTypes.DECIMAL(12, 2) },
        expected_ctc: { type: DataTypes.DECIMAL(12, 2) },
        notice_period: { type: DataTypes.STRING(100) },
        highest_qualification: { type: DataTypes.STRING(255), allowNull: false },
        specialization: { type: DataTypes.STRING(255) },
        university_institution: { type: DataTypes.STRING(255) },
        year_of_passing: { type: DataTypes.INTEGER },
        percentage_cgpa: { type: DataTypes.STRING(20) },
        application_status: {
            type: DataTypes.ENUM('New', 'Under Review', 'Shortlisted', 'Interview Scheduled', 'Selected', 'Rejected', 'On Hold'),
            defaultValue: 'New'
        },
        admin_notes: { type: DataTypes.TEXT },
        internal_rating: { type: DataTypes.TINYINT },
        assigned_to: { type: DataTypes.STRING(100) },
        follow_up_date: { type: DataTypes.DATEONLY },
        interview_date: { type: DataTypes.DATE },
        interview_mode: { type: DataTypes.ENUM('Online', 'In-person') },
        follow_up_notes: { type: DataTypes.TEXT },
        response_date: { type: DataTypes.DATEONLY },
        applied_date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
        created_by: { type: DataTypes.STRING(100) },
        updated_by: { type: DataTypes.STRING(100) }
    },
    {
        tableName: 'career_applications',
        timestamps: true,
        createdAt: 'created_date',
        updatedAt: 'updated_date'
    }
);

export default CareerApplication;
