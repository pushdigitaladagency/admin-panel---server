import { CareerPost, CareerApplication } from '../model/index.mjs';
import { crudController, setStatusField } from './crudFactory.mjs';

// --- Career posts (job openings) ---
export const careerPostController = crudController(CareerPost, {
    audit: true,
    slugFrom: 'job_title',
    writable: [
        'job_title', 'department', 'job_code', 'job_summary', 'job_description',
        'roles_responsibilities', 'key_requirements', 'educational_qualification',
        'no_of_vacancies', 'employment_type', 'minimum_experience', 'maximum_experience',
        'experience_level', 'salary_min', 'salary_max', 'salary_currency', 'salary_period',
        'hide_salary', 'required_skills', 'preferred_skills', 'technologies_tools',
        'job_location', 'city', 'state', 'country', 'work_mode', 'publish_date',
        'application_deadline', 'featured_job', 'status',
        'meta_title', 'meta_keywords', 'meta_description', 'canonical_url'
    ],
    filterFields: ['department', 'employment_type', 'experience_level', 'work_mode', 'status', 'featured_job'],
    searchFields: ['job_title', 'job_code', 'department'],
    defaultOrder: [['publish_date', 'DESC']],
    notFound: 'Career post not found'
});

export const publishCareerPost = setStatusField(CareerPost, { field: 'status', value: 'Published', audit: true, notFound: 'Career post not found' });
export const unpublishCareerPost = setStatusField(CareerPost, { field: 'status', value: 'Draft', audit: true, notFound: 'Career post not found' });
export const closeCareerPost = setStatusField(CareerPost, { field: 'status', value: 'Closed', audit: true, notFound: 'Career post not found' });

// --- Career applications (candidate submissions + admin workflow) ---
export const careerApplicationController = crudController(CareerApplication, {
    audit: true,
    writable: [
        'full_name', 'email', 'mobile_number', 'date_of_birth', 'gender', 'current_location',
        'linkedin_profile', 'portfolio_website', 'resume_cv', 'cover_letter',
        'cover_letter_attachment', 'applied_position', 'department', 'job_code',
        'preferred_location', 'total_experience', 'current_company', 'current_designation',
        'current_ctc', 'expected_ctc', 'notice_period', 'highest_qualification',
        'specialization', 'university_institution', 'year_of_passing', 'percentage_cgpa',
        'application_status', 'admin_notes', 'internal_rating', 'assigned_to',
        'follow_up_date', 'interview_date', 'interview_mode', 'follow_up_notes', 'response_date'
    ],
    filterFields: ['application_status', 'applied_position', 'department', 'job_code', 'gender', 'assigned_to'],
    searchFields: ['full_name', 'email', 'applied_position', 'mobile_number'],
    defaultOrder: [['applied_date', 'DESC']],
    notFound: 'Application not found'
});
