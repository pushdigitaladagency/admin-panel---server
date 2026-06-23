import express from 'express';
import {
    newsController as ctrl,
    newsCategoryController as cat,
    publish, unpublish, archive,
    listNewsGallery, addNewsGallery, removeNewsGallery
} from '../controller/newsController.mjs';
import requirePermission from '../middleware/permission.mjs';

const router = express.Router();
const can = (action) => requirePermission('news', action);

// Auth enforced globally in routes/index.js.
// Categories
router.get('/news-categories', can('view'), cat.list);
router.get('/news-categories/:id', can('view'), cat.getById);
router.post('/news-categories', can('create'), cat.create);
router.put('/news-categories/:id', can('edit'), cat.update);
router.delete('/news-categories/:id', can('delete'), cat.remove);

// Per-article gallery images
router.get('/news/:newsId/gallery', can('view'), listNewsGallery);
router.post('/news/:newsId/gallery', can('edit'), addNewsGallery);
router.delete('/news/gallery/:imageId', can('edit'), removeNewsGallery);

// News articles
router.get('/news', can('view'), ctrl.list);
router.get('/news/:id', can('view'), ctrl.getById);
router.post('/news', can('create'), ctrl.create);
router.put('/news/:id', can('edit'), ctrl.update);
router.delete('/news/:id', can('delete'), ctrl.remove);
router.patch('/news/:id/publish', can('publish'), publish);
router.patch('/news/:id/unpublish', can('publish'), unpublish);
router.patch('/news/:id/archive', can('publish'), archive);

export default router;
