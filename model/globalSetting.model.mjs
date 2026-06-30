import { DataTypes } from 'sequelize';
import sequelize from '../config/db.mjs';

// Mirrors the live `global_settings` table — a single-row, site-wide configuration
// record (general, company, contact, social, SMTP, branding, SEO, analytics, maps,
// footer, maintenance and security/upload settings). Only `updated_date` is tracked
// (no created_date column), so this is timestamped on update only.
const GlobalSetting = sequelize.define(
    'GlobalSetting',
    {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

        // --- General ---
        site_name: { type: DataTypes.STRING(255), allowNull: false },
        site_tagline: { type: DataTypes.STRING(255) },
        default_language: { type: DataTypes.STRING(100), defaultValue: 'English' },
        timezone: { type: DataTypes.STRING(100), allowNull: false },
        date_format: { type: DataTypes.STRING(50) },
        time_format: { type: DataTypes.STRING(50) },
        currency: { type: DataTypes.STRING(50) },

        // --- Company ---
        company_name: { type: DataTypes.STRING(255), allowNull: false },
        company_registration_no: { type: DataTypes.STRING(100) },
        gst_tax_number: { type: DataTypes.STRING(100) },
        founded_year: { type: DataTypes.INTEGER },
        about_company: { type: DataTypes.TEXT },

        // --- Address ---
        address: { type: DataTypes.TEXT, allowNull: false },
        city: { type: DataTypes.STRING(100) },
        state: { type: DataTypes.STRING(100) },
        country: { type: DataTypes.STRING(100) },
        postal_code: { type: DataTypes.STRING(20) },

        // --- Contact ---
        primary_email: { type: DataTypes.STRING(255), allowNull: false },
        secondary_email: { type: DataTypes.STRING(255) },
        primary_phone: { type: DataTypes.STRING(20), allowNull: false },
        secondary_phone: { type: DataTypes.STRING(20) },
        whatsapp_number: { type: DataTypes.STRING(20) },
        toll_free_number: { type: DataTypes.STRING(20) },

        // --- Social ---
        facebook_url: { type: DataTypes.STRING(255) },
        twitter_url: { type: DataTypes.STRING(255) },
        linkedin_url: { type: DataTypes.STRING(255) },
        instagram_url: { type: DataTypes.STRING(255) },
        youtube_url: { type: DataTypes.STRING(255) },
        pinterest_url: { type: DataTypes.STRING(255) },
        whatsapp_url: { type: DataTypes.STRING(255) },

        // --- SMTP / Email ---
        admin_email: { type: DataTypes.STRING(255), allowNull: false },
        from_name: { type: DataTypes.STRING(255) },
        from_email: { type: DataTypes.STRING(255), allowNull: false },
        reply_to_email: { type: DataTypes.STRING(255) },
        cc_email: { type: DataTypes.STRING(255) },
        bcc_email: { type: DataTypes.STRING(255) },
        smtp_host: { type: DataTypes.STRING(255) },
        smtp_port: { type: DataTypes.INTEGER },
        smtp_username: { type: DataTypes.STRING(255) },
        smtp_password: { type: DataTypes.STRING(255) },
        encryption: { type: DataTypes.ENUM('SSL', 'TLS', 'None'), defaultValue: 'TLS' },
        smtp_status: { type: DataTypes.ENUM('Enabled', 'Disabled'), defaultValue: 'Enabled' },

        // --- Branding ---
        site_logo: { type: DataTypes.STRING(255) },
        footer_logo: { type: DataTypes.STRING(255) },
        mobile_logo: { type: DataTypes.STRING(255) },
        favicon: { type: DataTypes.STRING(255) },
        default_og_image: { type: DataTypes.STRING(255) },

        // --- SEO defaults ---
        default_meta_title: { type: DataTypes.STRING(255) },
        default_meta_keywords: { type: DataTypes.TEXT },
        default_meta_description: { type: DataTypes.TEXT },
        default_canonical_url: { type: DataTypes.STRING(255) },
        robots: { type: DataTypes.ENUM('index, follow', 'noindex, nofollow'), defaultValue: 'index, follow' },

        // --- Analytics / scripts ---
        google_analytics_id: { type: DataTypes.STRING(100) },
        google_tag_manager_id: { type: DataTypes.STRING(100) },
        facebook_pixel_id: { type: DataTypes.STRING(100) },
        header_scripts: { type: DataTypes.TEXT('long') },
        footer_scripts: { type: DataTypes.TEXT('long') },

        // --- Maps ---
        google_maps_api_key: { type: DataTypes.STRING(255) },
        map_embed_url: { type: DataTypes.TEXT },
        latitude: { type: DataTypes.DECIMAL(10, 8) },
        longitude: { type: DataTypes.DECIMAL(11, 8) },
        map_zoom_level: { type: DataTypes.INTEGER, defaultValue: 15 },

        // --- Footer ---
        copyright_text: { type: DataTypes.TEXT },
        powered_by_text: { type: DataTypes.STRING(255) },
        footer_note: { type: DataTypes.TEXT },

        // --- Maintenance ---
        maintenance_mode: { type: DataTypes.ENUM('On', 'Off'), defaultValue: 'Off' },
        maintenance_message: { type: DataTypes.TEXT },
        allowed_ip_addresses: { type: DataTypes.TEXT },
        expected_back_online: { type: DataTypes.DATE },

        // --- Security ---
        enable_recaptcha: { type: DataTypes.ENUM('Yes', 'No'), defaultValue: 'No' },
        recaptcha_site_key: { type: DataTypes.STRING(255) },
        recaptcha_secret_key: { type: DataTypes.STRING(255) },
        session_timeout: { type: DataTypes.INTEGER, defaultValue: 30 },
        max_login_attempts: { type: DataTypes.INTEGER, defaultValue: 5 },
        force_https: { type: DataTypes.ENUM('Yes', 'No'), defaultValue: 'Yes' },
        enable_two_factor: { type: DataTypes.ENUM('Yes', 'No'), defaultValue: 'No' },

        // --- Uploads ---
        max_upload_size: { type: DataTypes.INTEGER, defaultValue: 25 },
        allowed_image_formats: { type: DataTypes.STRING(255) },
        allowed_document_formats: { type: DataTypes.STRING(255) },
        image_compression: { type: DataTypes.ENUM('Yes', 'No'), defaultValue: 'Yes' },
        max_image_dimensions: { type: DataTypes.STRING(50) },

        updated_by: { type: DataTypes.INTEGER }
    },
    {
        tableName: 'global_settings',
        timestamps: true,
        createdAt: false,
        updatedAt: 'updated_date'
    }
);

export default GlobalSetting;
