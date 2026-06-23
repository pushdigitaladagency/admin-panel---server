import { News, NewsCategory, NewsGallery, User } from '../model/index.mjs';
import { crudController, setStatusField } from './crudFactory.mjs';
import { handleError } from '../utils/helpers.mjs';

const CATEGORY = { model: NewsCategory, as: 'category', attributes: ['id', 'name', 'slug'] };
const GALLERY = { model: NewsGallery, as: 'gallery', attributes: ['id', 'image_path', 'alt_text', 'caption', 'sort_order'] };
const AUTHOR = { model: User, as: 'authorUser', attributes: ['id', 'first_name', 'last_name'] };

export const newsController = crudController(News, {
    include: [CATEGORY, GALLERY, AUTHOR],
    audit: true,
    slugFrom: 'title',
    writable: [
        'title', 'category_id', 'summary', 'full_content', 'featured_image',
        'news_source', 'author', 'author_id', 'publish_date', 'tags', 'featured',
        'seo_title', 'seo_keywords', 'seo_description', 'canonical_url', 'status'
    ],
    filterFields: ['category_id', 'status', 'featured'],
    searchFields: ['title', 'author'],
    defaultOrder: [['publish_date', 'DESC']],
    notFound: 'News article not found'
});

export const publish = setStatusField(News, { field: 'status', value: 'Published', audit: true, notFound: 'News article not found' });
export const unpublish = setStatusField(News, { field: 'status', value: 'Draft', audit: true, notFound: 'News article not found' });
export const archive = setStatusField(News, { field: 'status', value: 'Archived', audit: true, notFound: 'News article not found' });

export const newsCategoryController = crudController(NewsCategory, {
    slugFrom: 'name',
    writable: ['name', 'description', 'status'],
    searchFields: ['name'],
    defaultOrder: [['name', 'ASC']],
    notFound: 'Category not found'
});

// --- Per-article gallery images (1:N child of news) ---

export const listNewsGallery = async (req, res) => {
    try {
        const images = await NewsGallery.findAll({
            where: { news_id: req.params.newsId },
            order: [['sort_order', 'ASC'], ['id', 'ASC']]
        });
        res.json({ success: true, data: images });
    } catch (error) {
        handleError(res, error);
    }
};

export const addNewsGallery = async (req, res) => {
    try {
        const news = await News.findByPk(req.params.newsId, { attributes: ['id'] });
        if (!news) return res.status(404).json({ success: false, error: 'News article not found' });

        const { image_path, alt_text, caption, sort_order } = req.body;
        if (!image_path) return res.status(400).json({ success: false, error: 'image_path is required' });

        const image = await NewsGallery.create({
            news_id: news.id, image_path, alt_text, caption, sort_order: sort_order ?? 0
        });
        res.status(201).json({ success: true, data: image });
    } catch (error) {
        handleError(res, error);
    }
};

export const removeNewsGallery = async (req, res) => {
    try {
        const image = await NewsGallery.findByPk(req.params.imageId);
        if (!image) return res.status(404).json({ success: false, error: 'Image not found' });
        await image.destroy();
        res.json({ success: true, message: 'Image removed' });
    } catch (error) {
        handleError(res, error);
    }
};
