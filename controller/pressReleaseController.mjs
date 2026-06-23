import { PressRelease, PressReleaseCategory } from '../model/index.mjs';
import { crudController, setStatusField } from './crudFactory.mjs';

const CATEGORY = { model: PressReleaseCategory, as: 'category', attributes: ['id', 'name', 'slug'] };

export const pressReleaseController = crudController(PressRelease, {
    include: [CATEGORY],
    audit: true,
    slugFrom: 'title',
    writable: [
        'title', 'category_id', 'short_description', 'detailed_content', 'featured_image',
        'attachment', 'publish_date', 'expiry_date', 'tags', 'featured',
        'seo_title', 'seo_keywords', 'seo_description', 'canonical_url', 'status'
    ],
    filterFields: ['category_id', 'status', 'featured'],
    searchFields: ['title'],
    defaultOrder: [['publish_date', 'DESC']],
    notFound: 'Press release not found'
});

export const publish = setStatusField(PressRelease, { field: 'status', value: 'Published', audit: true, notFound: 'Press release not found' });
export const unpublish = setStatusField(PressRelease, { field: 'status', value: 'Draft', audit: true, notFound: 'Press release not found' });

export const pressReleaseCategoryController = crudController(PressReleaseCategory, {
    slugFrom: 'name',
    writable: ['name', 'description', 'status'],
    searchFields: ['name'],
    defaultOrder: [['name', 'ASC']],
    notFound: 'Category not found'
});
