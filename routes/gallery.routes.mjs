import express from 'express';
import {
    galleryCategoryController as cat,
    galleryAlbumController as album,
    galleryVideoController as video,
    publishAlbum, unpublishAlbum,
    listAlbumImages, addAlbumImage, updateAlbumImage, removeAlbumImage
} from '../controller/galleryController.mjs';
import requirePermission from '../middleware/permission.mjs';

const router = express.Router();
const can = (action) => requirePermission('gallery', action);

// Auth enforced globally in routes/index.js.
// Categories
router.get('/gallery-categories', can('view'), cat.list);
router.get('/gallery-categories/:id', can('view'), cat.getById);
router.post('/gallery-categories', can('create'), cat.create);
router.put('/gallery-categories/:id', can('edit'), cat.update);
router.delete('/gallery-categories/:id', can('delete'), cat.remove);

// Videos
router.get('/gallery-videos', can('view'), video.list);
router.get('/gallery-videos/:id', can('view'), video.getById);
router.post('/gallery-videos', can('create'), video.create);
router.put('/gallery-videos/:id', can('edit'), video.update);
router.delete('/gallery-videos/:id', can('delete'), video.remove);

// Album images (1:N child of an album)
router.get('/gallery-albums/:albumId/images', can('view'), listAlbumImages);
router.post('/gallery-albums/:albumId/images', can('edit'), addAlbumImage);
router.put('/gallery-images/:imageId', can('edit'), updateAlbumImage);
router.delete('/gallery-images/:imageId', can('edit'), removeAlbumImage);

// Albums
router.get('/gallery-albums', can('view'), album.list);
router.get('/gallery-albums/:id', can('view'), album.getById);
router.post('/gallery-albums', can('create'), album.create);
router.put('/gallery-albums/:id', can('edit'), album.update);
router.delete('/gallery-albums/:id', can('delete'), album.remove);
router.patch('/gallery-albums/:id/publish', can('publish'), publishAlbum);
router.patch('/gallery-albums/:id/unpublish', can('publish'), unpublishAlbum);

export default router;
