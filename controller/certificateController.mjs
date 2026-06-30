import { Certificate } from '../model/index.mjs';
import { crudController, setStatusField } from './crudFactory.mjs';

export const certificateController = crudController(Certificate, {
    audit: true,
    slugFrom: 'certificate_title',
    writable: [
        'certificate_title', 'certificate_number', 'issuing_authority', 'issue_date',
        'expiry_date', 'description', 'display_order', 'featured', 'certificate_image',
        'pdf_attachment', 'thumbnail_image', 'alt_text', 'meta_title', 'meta_keywords',
        'meta_description', 'canonical_url', 'status'
    ],
    filterFields: ['status', 'featured', 'issuing_authority'],
    searchFields: ['certificate_title', 'certificate_number', 'issuing_authority'],
    defaultOrder: [['display_order', 'ASC'], ['id', 'DESC']],
    notFound: 'Certificate not found'
});

export const activateCertificate = setStatusField(Certificate, { field: 'status', value: 'Active', audit: true, notFound: 'Certificate not found' });
export const deactivateCertificate = setStatusField(Certificate, { field: 'status', value: 'Inactive', audit: true, notFound: 'Certificate not found' });
