import { ClientPartnerLogo } from '../model/index.mjs';
import { crudController } from './crudFactory.mjs';

export const clientPartnerLogoController = crudController(ClientPartnerLogo, {
    audit: true,
    writable: [
        'client_partner_name', 'category', 'website_url', 'short_description',
        'logo_image', 'alt_text', 'display_order', 'featured', 'status',
        'meta_title', 'meta_description'
    ],
    filterFields: ['category', 'status', 'featured'],
    searchFields: ['client_partner_name'],
    defaultOrder: [['display_order', 'ASC'], ['id', 'DESC']],
    notFound: 'Logo not found'
});
