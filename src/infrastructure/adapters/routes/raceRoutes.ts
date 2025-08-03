import { Router } from 'express';
import { container } from '@shared/container';
import { RaceController } from '@infrastructure/adapters/controllers/race-controller';
import { TYPES } from '@shared/types/container';

const router = Router();
const raceController = container.get<RaceController>(TYPES.RaceController);

router.get('/', (req, res, next) => raceController.findAll(req, res, next));
router.get('/:id', (req, res, next) => raceController.findById(req, res, next));
router.post('/', (req, res, next) => raceController.create(req, res, next));
router.put('/:id', (req, res, next) => raceController.update(req, res, next));
router.delete('/:id', (req, res, next) => raceController.deleteById(req, res, next));

export { router as raceRouter };
