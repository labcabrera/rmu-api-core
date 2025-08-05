import { Router } from 'express';
import { container } from '@shared/container';
import { RaceController } from '@infrastructure/adapters/inbound/web/controllers/race.controller';
import { asyncHandler } from '@infrastructure/adapters/inbound/web/async-handler';
import { createAuthMiddleware, requireRoles } from '@infrastructure/adapters/inbound/web/security/auth.middleware';

const router = Router();
const raceController = container.get<RaceController>('RaceController');

const authMiddleware = createAuthMiddleware();

router.get(
  '/',
  authMiddleware,
  asyncHandler(async (req, res, next) => {
    await raceController.find(req, res, next);
  })
);

router.get(
  '/:id',
  authMiddleware,
  asyncHandler(async (req, res, next) => {
    await raceController.findById(req, res, next);
  })
);

router.post(
  '/',
  authMiddleware,
  requireRoles(['admin']),
  asyncHandler(async (req, res, next) => {
    await raceController.create(req, res, next);
  })
);

router.put(
  '/:id',
  authMiddleware,
  requireRoles(['admin']),
  asyncHandler(async (req, res, next) => {
    await raceController.update(req, res, next);
  })
);

router.delete(
  '/:id',
  authMiddleware,
  requireRoles(['admin']),
  asyncHandler(async (req, res, next) => {
    await raceController.delete(req, res, next);
  })
);

export { router as raceRouter };
