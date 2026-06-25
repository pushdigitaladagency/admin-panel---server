import { ActionLog } from '../model/index.mjs';

export const logAction = async (req, action, modelName, recordId = null, details = null) => {
    try {
        const userId = req.user?.id || null;
        const username = req.user?.username || req.user?.email || 'System';
        // Extract, normalize, and truncate the client IP address to fit in VARCHAR(45)
        let ip = req.headers['x-forwarded-for'] || req.ip || req.connection?.remoteAddress || req.socket?.remoteAddress || '127.0.0.1';
        if (ip && ip.includes(',')) {
            ip = ip.split(',')[0].trim();
        }
        if (ip && ip.startsWith('::ffff:')) {
            ip = ip.substring(7);
        }
        if (ip === '::1') {
            ip = '127.0.0.1';
        }
        const ipAddress = ip ? ip.slice(0, 45) : '127.0.0.1';

        await ActionLog.create({
            action,
            model: modelName,
            record_id: recordId,
            user_id: userId,
            username,
            ip_address: ipAddress,
            details: details ? (typeof details === 'string' ? details : JSON.stringify(details)) : null
        });
    } catch (err) {
        console.error('Failed to log action:', err);
    }
};
