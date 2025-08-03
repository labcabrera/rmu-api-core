import { Router } from 'express';
import { container } from '@shared/container';
import { RaceController } from '../controllers/race-controller';
import { asyncHandler } from '../async-handler';

const router = Router();
const raceController = container.get<RaceController>('RaceController');

router.get(
  '/',
  asyncHandler(async (req, res, next) => {
    await raceController.find(req, res, next);
  })
);

router.get(
  '/:id',
  asyncHandler(async (req, res, next) => {
    await raceController.findById(req, res, next);
  })
);

router.post(
  '/',
  asyncHandler(async (req, res, next) => {
    await raceController.create(req, res, next);
  })
);

router.put(
  '/:id',
  asyncHandler(async (req, res, next) => {
    await raceController.update(req, res, next);
  })
);

router.delete(
  '/:id',
  asyncHandler(async (req, res, next) => {
    await raceController.delete(req, res, next);
  })
);

export { router as raceRouter };
