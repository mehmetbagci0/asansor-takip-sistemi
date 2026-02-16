import { Router } from 'express';
import {
  getAllMaintenances,
  getMaintenanceById,
  createMaintenance,
  updateMaintenance,
  completeMaintenance,
  updateChecklistItem,
  addUsedMaterial,
  downloadMaintenancePDF,
  downloadMaintenanceExcel,
} from '../controllers/maintenance.controller';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

// Tüm route'lar authenticate edilmiş olmalı
router.use(authenticate);

router.get('/', getAllMaintenances);
router.get('/:id', getMaintenanceById);
router.post('/', authorize('ADMIN', 'MANAGER', 'TECHNICIAN'), createMaintenance);
router.put('/:id', authorize('ADMIN', 'MANAGER', 'TECHNICIAN'), updateMaintenance);
router.post('/:id/complete', authorize('ADMIN', 'MANAGER', 'TECHNICIAN'), completeMaintenance);
router.put('/checklist/:id', authorize('ADMIN', 'MANAGER', 'TECHNICIAN'), updateChecklistItem);
router.post('/:maintenanceId/materials', authorize('ADMIN', 'MANAGER', 'TECHNICIAN'), addUsedMaterial);
router.get('/:id/pdf', downloadMaintenancePDF);
router.get('/:id/excel', downloadMaintenanceExcel);

export default router;
