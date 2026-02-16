import { Router } from 'express';
import {
  getAllElevators,
  getElevatorById,
  createElevator,
  updateElevator,
  deleteElevator,
  regenerateQRCode,
} from '../controllers/elevator.controller';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

// Tüm route'lar authenticate edilmiş olmalı
router.use(authenticate);

router.get('/', getAllElevators);
router.get('/:id', getElevatorById);
router.post('/', authorize('ADMIN', 'MANAGER'), createElevator);
router.put('/:id', authorize('ADMIN', 'MANAGER'), updateElevator);
router.delete('/:id', authorize('ADMIN'), deleteElevator);
router.post('/:id/qrcode', authorize('ADMIN', 'MANAGER'), regenerateQRCode);

export default router;
