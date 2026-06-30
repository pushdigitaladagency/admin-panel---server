import { DataTypes } from 'sequelize';
import sequelize from '../config/db.mjs';

// Mirrors the live `career_posts` table (job openings).
// Schema uses created_date/updated_date and has no deleted_at, so not paranoid.
const CareerPost = sequelize.define(
    'CareerPost',
    {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        job_title: { type: DataTypes.STRING(255), allowNull: false },
        slug: { type: DataTypes.STRING(255), unique: true },
        department: { type: DataTypes.STRING(150), allowNull: false },
        job_code: { type: DataTypes.STRING(100) },
        job_summary: { type: DataTypes.TEXT, allowNull: false },
        job_description: { type: DataTypes.TEXT('long'), allowNull: false },
        roles_responsibilities: { type: DataTypes.TEXT('long'), allowNull: false },
        key_requirements: { type: DataTypes.TEXT('long'), allowNull: false },
        educational_qualification: { type: DataTypes.TEXT, allowNull: false },
        no_of_vacancies: { type: DataTypes.INTEGER, allowNull: false },
        employment_type: {
            type: DataTypes.ENUM('Full Time', 'Part Time', 'Contract', 'Internship', 'Freelance', 'Remote'),
            allowNull: false
        },
        minimum_experience: { type: DataTypes.DECIMAL(4, 1), allowNull: false },
        maximum_experience: { type: DataTypes.DECIMAL(4, 1) },
        experience_level: {
            type: DataTypes.ENUM('Fresher', 'Junior', 'Mid-Level', 'Senior', 'Lead'),
            allowNull: false
        },
        salary_min: { type: DataTypes.DECIMAL(12, 2) },
        salary_max: { type: DataTypes.DECIMAL(12, 2) },
        salary_currency: { type: DataTypes.STRING(10), defaultValue: 'INR' },
        salary_period: { type: DataTypes.ENUM('Monthly', 'Annual') },
        hide_salary: { type: DataTypes.ENUM('Yes', 'No'), defaultValue: 'No' },
        required_skills: { type: DataTypes.TEXT, allowNull: false },
        preferred_skills: { type: DataTypes.TEXT },
        technologies_tools: { type: DataTypes.TEXT },
        job_location: { type: DataTypes.STRING(255), allowNull: false },
        city: { type: DataTypes.STRING(100), allowNull: false },
        state: { type: DataTypes.STRING(100) },
        country: { type: DataTypes.STRING(100), allowNull: false },
        work_mode: { type: DataTypes.ENUM('On-site', 'Hybrid', 'Remote'), allowNull: false },
        publish_date: { type: DataTypes.DATEONLY, allowNull: false },
        application_deadline: { type: DataTypes.DATEONLY, allowNull: false },
        featured_job: { type: DataTypes.ENUM('Yes', 'No'), defaultValue: 'No' },
        status: {
            type: DataTypes.ENUM('Draft', 'Published', 'Open', 'Closed', 'On Hold', 'Archived'),
            defaultValue: 'Draft'
        },
        meta_title: { type: DataTypes.STRING(255) },
        meta_keywords: { type: DataTypes.TEXT },
        meta_description: { type: DataTypes.TEXT },
        canonical_url: { type: DataTypes.STRING(500) },
        created_by: { type: DataTypes.STRING(100) },
        updated_by: { type: DataTypes.STRING(100) }
    },
    {
        tableName: 'career_posts',
        timestamps: true,
        createdAt: 'created_date',
        updatedAt: 'updated_date'
    }
);

export default CareerPost;
