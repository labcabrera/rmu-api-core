import { Router } from 'express';
import { container } from '@shared/container';
import { RaceController } from '../controllers/race.controller';
import { asyncHandler } from '../async-handler';
import { createAuthMiddleware, requireRoles } from '../security/auth.middleware';

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
