import { Router } from 'express';
import { container } from '@shared/container';
import { createAuthMiddleware, requireRoles } from '../middleware/auth.middleware';
import { RealmController } from '../controllers/realm-controller';
import { asyncHandler } from '../async-handler';

const router = Router();
const realmController = container.get<RealmController>('RealmController');

const authMiddleware = createAuthMiddleware();

router.get(
  '/',
  authMiddleware,
  asyncHandler(async (req, res, next) => await realmController.find(req, res, next))
);
router.get(
  '/:id',
  authMiddleware,
  asyncHandler(async (req, res, next) => await realmController.findById(req, res, next))
);
router.post(
  '/',
  authMiddleware,
  requireRoles(['admin']),
  asyncHandler(async (req, res, next) => await realmController.create(req, res, next))
);
router.patch(
  '/:id',
  authMiddleware,
  requireRoles(['admin']),
  asyncHandler(async (req, res, next) => await realmController.update(req, res, next))
);
router.delete(
  '/:id',
  authMiddleware,
  requireRoles(['admin']),
  asyncHandler(async (req, res, next) => await realmController.deleteById(req, res, next))
);

export { router as realmRouter };
