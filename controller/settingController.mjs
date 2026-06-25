import { Setting } from '../model/index.mjs';
import { handleError, pickFields } from '../utils/helpers.mjs';
import { logAction } from '../utils/actionLogger.mjs';

const SETTINGS_WRITABLE = [
    'site_name',
    'site_description',
    'contact_email',
    'seo_default_title',
    'seo_default_description'
];

export const getSettings = async (req, res) => {
    try {
        let setting = await Setting.findOne();
        if (!setting) {
            setting = await Setting.create({
                site_name: 'CMS Admin Panel',
                site_description: 'Manage news, events, press releases and media library.',
                contact_email: 'admin@example.com',
                seo_default_title: 'Welcome to CMS',
                seo_default_description: 'Default SEO description'
            });
        }
        res.json({ success: true, data: setting });
    } catch (error) {
        handleError(res, error);
    }
};

export const updateSettings = async (req, res) => {
    try {
        let setting = await Setting.findOne();
        const updates = pickFields(req.body, SETTINGS_WRITABLE);
        
        if (!setting) {
            setting = await Setting.create(updates);
        } else {
            await setting.update(updates);
        }

        logAction(req, 'Updated Settings', 'Setting', setting.id, updates);

        res.json({ success: true, data: setting });
    } catch (error) {
        handleError(res, error);
    }
};
