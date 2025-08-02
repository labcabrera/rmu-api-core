import { Router } from 'express';
import { container } from '@shared/container';
import { TYPES } from '@shared/types/container';
import { CharacterSizeController } from '@infrastructure/adapters/controllers/CharacterSizeController';

const router = Router();
const characterSizeController = container.get<CharacterSizeController>(TYPES.CharacterSizeController);

router.get('/', (req, res) => characterSizeController.findAll(req, res));
router.get('/:id', (req, res) => characterSizeController.findById(req, res));
router.post('/', (req, res) => characterSizeController.create(req, res));
router.put('/:id', (req, res) => characterSizeController.update(req, res));
router.delete('/:id', (req, res) => characterSizeController.deleteById(req, res));
router.get('/attack-effects/:attackSizeId/:defenderSizeId', (req, res) => characterSizeController.findAttackEffects(req, res));

export default router;
