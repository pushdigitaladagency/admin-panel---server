import express from 'express';
import { clientPartnerLogoController as ctrl } from '../controller/clientPartnerLogoController.mjs';
import requirePermission from '../middleware/permission.mjs';

const router = express.Router();
const can = (action) => requirePermission('client_partner_logos', action);

router.get('/client-partner-logos', can('view'), ctrl.list);
router.get('/client-partner-logos/:id', can('view'), ctrl.getById);
router.post('/client-partner-logos', can('create'), ctrl.create);
router.put('/client-partner-logos/:id', can('edit'), ctrl.update);
router.delete('/client-partner-logos/:id', can('delete'), ctrl.remove);

export default router;
