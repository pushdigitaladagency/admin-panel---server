import { MetaMapping } from '../model/index.mjs';
import { crudController } from './crudFactory.mjs';

// SEO metadata keyed by page URL. `url` is the unique business key (no slug column).
export const metaMappingController = crudController(MetaMapping, {
    audit: true,
    writable: [
        'page_name', 'url', 'meta_title', 'meta_keywords', 'meta_description',
        'canonical_url', 'og_title', 'og_description', 'og_image', 'og_type', 'og_url',
        'twitter_card', 'twitter_title', 'twitter_description', 'twitter_image',
        'robots', 'schema_markup', 'header_scripts', 'footer_scripts', 'status'
    ],
    filterFields: ['status', 'robots'],
    searchFields: ['page_name', 'url', 'meta_title'],
    defaultOrder: [['page_name', 'ASC']],
    notFound: 'Meta mapping not found'
});
