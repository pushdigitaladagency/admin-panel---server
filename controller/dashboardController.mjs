import { Op } from 'sequelize';
import {
    sequelize,
    User, Role, Permission,
    News, Event, PressRelease,
    GalleryAlbum, Enquiry
} from '../model/index.mjs';
import { handleError } from '../utils/helpers.mjs';

// Helper to generate past N months
const getPastMonths = (n) => {
    const list = [];
    const date = new Date();
    // Set to 1st of current month first to avoid month boundary overflow issues (e.g. Feb 31st)
    date.setDate(1);
    for (let i = n - 1; i >= 0; i--) {
        const d = new Date(date.getFullYear(), date.getMonth() - i, 1);
        const year = d.getFullYear();
        const monthNum = String(d.getMonth() + 1).padStart(2, '0');
        const monthName = d.toLocaleString('en-US', { month: 'short' });
        list.push({
            key: `${year}-${monthNum}`,
            name: `${monthName} ${year}`
        });
    }
    return list;
};

// GET /api/dashboard/stats — aggregate counts and graph data for the dashboard.
export const getStats = async (_req, res) => {
    try {
        const twelveMonthsAgo = new Date();
        twelveMonthsAgo.setDate(1);
        twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 11);
        twelveMonthsAgo.setHours(0, 0, 0, 0);

        const [
            users, roles, permissions,
            news, events, pressReleases,
            galleryAlbums, enquiries,
            userGrowthRaw, newsRaw, eventsRaw, pressReleasesRaw
        ] = await Promise.all([
            User.count(),
            Role.count(),
            Permission.count(),
            News.count(),
            Event.count(),
            PressRelease.count(),
            GalleryAlbum.count(),
            Enquiry.count(),
            User.findAll({
                attributes: [
                    [sequelize.fn('DATE_FORMAT', sequelize.col('created_at'), '%Y-%m'), 'month'],
                    [sequelize.fn('COUNT', sequelize.col('id')), 'count']
                ],
                where: { created_at: { [Op.gte]: twelveMonthsAgo } },
                group: [sequelize.fn('DATE_FORMAT', sequelize.col('created_at'), '%Y-%m')],
                raw: true
            }),
            News.findAll({
                attributes: [
                    [sequelize.fn('DATE_FORMAT', sequelize.col('created_at'), '%Y-%m'), 'month'],
                    [sequelize.fn('COUNT', sequelize.col('id')), 'count']
                ],
                where: { created_at: { [Op.gte]: twelveMonthsAgo } },
                group: [sequelize.fn('DATE_FORMAT', sequelize.col('created_at'), '%Y-%m')],
                raw: true
            }),
            Event.findAll({
                attributes: [
                    [sequelize.fn('DATE_FORMAT', sequelize.col('created_at'), '%Y-%m'), 'month'],
                    [sequelize.fn('COUNT', sequelize.col('id')), 'count']
                ],
                where: { created_at: { [Op.gte]: twelveMonthsAgo } },
                group: [sequelize.fn('DATE_FORMAT', sequelize.col('created_at'), '%Y-%m')],
                raw: true
            }),
            PressRelease.findAll({
                attributes: [
                    [sequelize.fn('DATE_FORMAT', sequelize.col('created_at'), '%Y-%m'), 'month'],
                    [sequelize.fn('COUNT', sequelize.col('id')), 'count']
                ],
                where: { created_at: { [Op.gte]: twelveMonthsAgo } },
                group: [sequelize.fn('DATE_FORMAT', sequelize.col('created_at'), '%Y-%m')],
                raw: true
            })
        ]);

        const months = getPastMonths(12);

        // Map user counts
        const userMap = {};
        userGrowthRaw.forEach(row => {
            userMap[row.month] = parseInt(row.count, 10) || 0;
        });
        const userGrowth = months.map(m => ({
            name: m.name,
            key: m.key,
            users: userMap[m.key] || 0
        }));

        // Map post activity counts
        const newsMap = {};
        newsRaw.forEach(row => { newsMap[row.month] = parseInt(row.count, 10) || 0; });

        const eventsMap = {};
        eventsRaw.forEach(row => { eventsMap[row.month] = parseInt(row.count, 10) || 0; });

        const prMap = {};
        pressReleasesRaw.forEach(row => { prMap[row.month] = parseInt(row.count, 10) || 0; });

        const postActivity = months.map(m => ({
            name: m.name,
            key: m.key,
            news: newsMap[m.key] || 0,
            events: eventsMap[m.key] || 0,
            pressReleases: prMap[m.key] || 0
        }));

        res.json({
            success: true,
            data: {
                users, roles, permissions,
                news, events, pressReleases,
                galleryAlbums, enquiries,
                userGrowth,
                postActivity
            }
        });
    } catch (error) {
        handleError(res, error);
    }
};

// GET /api/dashboard/recent — latest content across post types.
export const getRecent = async (_req, res) => {
    try {
        const [latestNews, latestEvents, latestPR] = await Promise.all([
            News.findAll({ limit: 3, order: [['created_at', 'DESC']], attributes: ['id', 'title', 'status', 'author', 'created_at'] }),
            Event.findAll({ limit: 3, order: [['created_at', 'DESC']], attributes: ['id', 'title', 'event_status', 'created_at'] }),
            PressRelease.findAll({ limit: 3, order: [['created_at', 'DESC']], attributes: ['id', 'title', 'status', 'created_at'] }),
        ]);

        // Merge + sort by created_at desc, take top 6
        const all = [
            ...latestNews.map((n) => ({ ...n.toJSON(), post_type: 'news' })),
            ...latestEvents.map((e) => ({ ...e.toJSON(), post_type: 'event', status: e.event_status })),
            ...latestPR.map((p) => ({ ...p.toJSON(), post_type: 'press-release' })),
        ].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 6);

        res.json({ success: true, data: all });
    } catch (error) {
        handleError(res, error);
    }
};
