import { GlobalSetting } from '../model/index.mjs';
import { handleError, pickFields } from '../utils/helpers.mjs';
import { logAction } from '../utils/actionLogger.mjs';

// `global_settings` is a single-row table. We always operate on the first row.
const WRITABLE = [
    // General
    'site_name', 'site_tagline', 'default_language', 'timezone', 'date_format', 'time_format', 'currency',
    // Company
    'company_name', 'company_registration_no', 'gst_tax_number', 'founded_year', 'about_company',
    // Address
    'address', 'city', 'state', 'country', 'postal_code',
    // Contact
    'primary_email', 'secondary_email', 'primary_phone', 'secondary_phone', 'whatsapp_number', 'toll_free_number',
    // Social
    'facebook_url', 'twitter_url', 'linkedin_url', 'instagram_url', 'youtube_url', 'pinterest_url', 'whatsapp_url',
    // SMTP / Email
    'admin_email', 'from_name', 'from_email', 'reply_to_email', 'cc_email', 'bcc_email',
    'smtp_host', 'smtp_port', 'smtp_username', 'smtp_password', 'encryption', 'smtp_status',
    // Branding
    'site_logo', 'footer_logo', 'mobile_logo', 'favicon', 'default_og_image',
    // SEO
    'default_meta_title', 'default_meta_keywords', 'default_meta_description', 'default_canonical_url', 'robots',
    // Analytics
    'google_analytics_id', 'google_tag_manager_id', 'facebook_pixel_id', 'header_scripts', 'footer_scripts',
    // Maps
    'google_maps_api_key', 'map_embed_url', 'latitude', 'longitude', 'map_zoom_level',
    // Footer
    'copyright_text', 'powered_by_text', 'footer_note',
    // Maintenance
    'maintenance_mode', 'maintenance_message', 'allowed_ip_addresses', 'expected_back_online',
    // Security
    'enable_recaptcha', 'recaptcha_site_key', 'recaptcha_secret_key', 'session_timeout',
    'max_login_attempts', 'force_https', 'enable_two_factor',
    // Uploads
    'max_upload_size', 'allowed_image_formats', 'allowed_document_formats', 'image_compression', 'max_image_dimensions'
];

export const getGlobalSettings = async (req, res) => {
    try {
        const setting = await GlobalSetting.findOne({ order: [['id', 'ASC']] });
        res.json({ success: true, data: setting });
    } catch (error) {
        handleError(res, error);
    }
};

export const updateGlobalSettings = async (req, res) => {
    try {
        const updates = pickFields(req.body, WRITABLE);
        updates.updated_by = req.user?.id ?? null;

        let setting = await GlobalSetting.findOne({ order: [['id', 'ASC']] });
        if (!setting) {
            setting = await GlobalSetting.create(updates);
        } else {
            await setting.update(updates);
        }

        logAction(req, 'Updated Global Settings', 'GlobalSetting', setting.id, Object.keys(updates));

        res.json({ success: true, data: setting });
    } catch (error) {
        handleError(res, error);
    }
};
