import { GalleryCategory, GalleryAlbum, GalleryImage, GalleryVideo, Event } from '../model/index.mjs';
import { crudController, setStatusField } from './crudFactory.mjs';
import { handleError, pickFields } from '../utils/helpers.mjs';

const IMAGE_FIELDS = ['image_path', 'image_title', 'caption', 'alt_text', 'display_order', 'status'];

const CATEGORY = { model: GalleryCategory, as: 'category', attributes: ['id', 'name', 'slug'] };
const EVENT = { model: Event, as: 'event', attributes: ['id', 'title'] };
const IMAGES = { model: GalleryImage, as: 'images', attributes: ['id', 'image_path', 'image_title', 'caption', 'alt_text', 'display_order', 'status'] };

// --- Categories ---
export const galleryCategoryController = crudController(GalleryCategory, {
    slugFrom: 'name',
    writable: ['name', 'description', 'status'],
    searchFields: ['name'],
    defaultOrder: [['name', 'ASC']],
    notFound: 'Category not found'
});

// --- Albums ---
export const galleryAlbumController = crudController(GalleryAlbum, {
    include: [CATEGORY, EVENT, IMAGES],
    audit: true,
    writable: ['title', 'category_id', 'description', 'cover_image', 'event_id', 'status'],
    filterFields: ['category_id', 'event_id', 'status'],
    searchFields: ['title'],
    defaultOrder: [['created_at', 'DESC']],
    notFound: 'Album not found'
});

export const publishAlbum = setStatusField(GalleryAlbum, { field: 'status', value: true, audit: true, notFound: 'Album not found' });
export const unpublishAlbum = setStatusField(GalleryAlbum, { field: 'status', value: false, audit: true, notFound: 'Album not found' });

// --- Videos (standalone) ---
export const galleryVideoController = crudController(GalleryVideo, {
    writable: ['title', 'video_url', 'thumbnail_image', 'description', 'status'],
    searchFields: ['title'],
    defaultOrder: [['created_at', 'DESC']],
    notFound: 'Video not found'
});

// --- Images (1:N child of an album) ---
export const listAlbumImages = async (req, res) => {
    try {
        const images = await GalleryImage.findAll({
            where: { album_id: req.params.albumId },
            order: [['display_order', 'ASC'], ['id', 'ASC']]
        });
        res.json({ success: true, data: images });
    } catch (error) {
        handleError(res, error);
    }
};

export const addAlbumImage = async (req, res) => {
    try {
        const album = await GalleryAlbum.findByPk(req.params.albumId, { attributes: ['id'] });
        if (!album) return res.status(404).json({ success: false, error: 'Album not found' });

        const { image_path, image_title, caption, alt_text, display_order, status } = req.body;
        if (!image_path) return res.status(400).json({ success: false, error: 'image_path is required' });

        const image = await GalleryImage.create({
            album_id: album.id, image_path, image_title, caption, alt_text,
            display_order: display_order ?? 0, status: status ?? true
        });
        res.status(201).json({ success: true, data: image });
    } catch (error) {
        handleError(res, error);
    }
};

export const updateAlbumImage = async (req, res) => {
    try {
        const image = await GalleryImage.findByPk(req.params.imageId);
        if (!image) return res.status(404).json({ success: false, error: 'Image not found' });
        await image.update(pickFields(req.body, IMAGE_FIELDS));
        res.json({ success: true, data: image });
    } catch (error) {
        handleError(res, error);
    }
};

export const removeAlbumImage = async (req, res) => {
    try {
        const image = await GalleryImage.findByPk(req.params.imageId);
        if (!image) return res.status(404).json({ success: false, error: 'Image not found' });
        await image.destroy();
        res.json({ success: true, message: 'Image removed' });
    } catch (error) {
        handleError(res, error);
    }
};
