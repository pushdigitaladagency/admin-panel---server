import express from 'express';
import {
    investorCategoryController as cat,
    investorDocumentController as doc,
    publishInvestorDocument, unpublishInvestorDocument, archiveInvestorDocument
} from '../controller/investorController.mjs';
import requirePermission, { requirePublishToChangeStatus, requirePublishToSetStatus } from '../middleware/permission.mjs';
import { InvestorDocument } from '../model/index.mjs';

const router = express.Router();
const can = (action) => requirePermission('investors', action);

// --- Investor categories (governed by the investors module) ---
router.get('/investor-categories', can('view'), cat.list);
router.get('/investor-categories/:id', can('view'), cat.getById);
router.post('/investor-categories', can('create'), cat.create);
router.put('/investor-categories/:id', can('edit'), cat.update);
router.delete('/investor-categories/:id', can('delete'), cat.remove);

// --- Investor documents ---
router.get('/investor-documents', can('view'), doc.list);
router.get('/investor-documents/:id', can('view'), doc.getById);
router.post('/investor-documents', can('create'), requirePublishToSetStatus('status', 'investors'), doc.create);
router.put('/investor-documents/:id', can('edit'), requirePublishToChangeStatus(InvestorDocument, 'status', 'investors'), doc.update);
router.delete('/investor-documents/:id', can('delete'), doc.remove);
router.patch('/investor-documents/:id/publish', can('publish'), publishInvestorDocument);
router.patch('/investor-documents/:id/unpublish', can('publish'), unpublishInvestorDocument);
router.patch('/investor-documents/:id/archive', can('publish'), archiveInvestorDocument);

export default router;
