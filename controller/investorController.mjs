import { InvestorCategory, InvestorDocument } from '../model/index.mjs';
import { crudController, setStatusField } from './crudFactory.mjs';

const CATEGORY = { model: InvestorCategory, as: 'category', attributes: ['id', 'category_name', 'slug'] };

// --- Investor categories ---
export const investorCategoryController = crudController(InvestorCategory, {
    audit: true,
    slugFrom: 'category_name',
    writable: [
        'category_name', 'description', 'display_order', 'status',
        'meta_title', 'meta_keywords', 'meta_description', 'canonical_url'
    ],
    filterFields: ['status'],
    searchFields: ['category_name'],
    defaultOrder: [['display_order', 'ASC'], ['category_name', 'ASC']],
    notFound: 'Investor category not found'
});

// --- Investor documents ---
export const investorDocumentController = crudController(InvestorDocument, {
    include: [CATEGORY],
    audit: true,
    slugFrom: 'title',
    writable: [
        'title', 'category_id', 'financial_year', 'description', 'publish_date',
        'featured', 'display_order', 'pdf_file', 'file_size', 'status',
        'meta_title', 'meta_keywords', 'meta_description', 'canonical_url'
    ],
    filterFields: ['category_id', 'status', 'featured', 'financial_year'],
    searchFields: ['title', 'financial_year'],
    defaultOrder: [['publish_date', 'DESC']],
    notFound: 'Investor document not found'
});

export const publishInvestorDocument = setStatusField(InvestorDocument, { field: 'status', value: 'Published', audit: true, notFound: 'Investor document not found' });
export const unpublishInvestorDocument = setStatusField(InvestorDocument, { field: 'status', value: 'Draft', audit: true, notFound: 'Investor document not found' });
export const archiveInvestorDocument = setStatusField(InvestorDocument, { field: 'status', value: 'Archived', audit: true, notFound: 'Investor document not found' });
