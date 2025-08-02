import { Router } from 'express';
import { container } from '@shared/container';
import { TYPES } from '@shared/types/container';
import { CharacterSizeController } from '@infrastructure/adapters/controllers/CharacterSizeController';

const router = Router();
const characterSizeController = container.get<CharacterSizeController>(TYPES.CharacterSizeController);

// GET /v1/character-sizes
router.get('/', (req, res) => characterSizeController.findAll(req, res));

// GET /v1/character-sizes/:id
router.get('/:id', (req, res) => characterSizeController.findById(req, res));

// POST /v1/character-sizes
router.post('/', (req, res) => characterSizeController.create(req, res));

// PUT /v1/character-sizes/:id
router.put('/:id', (req, res) => characterSizeController.update(req, res));

// DELETE /v1/character-sizes/:id
router.delete('/:id', (req, res) => characterSizeController.deleteById(req, res));

// GET /v1/character-sizes/attack-effects/:attackSizeId/:defenderSizeId
router.get('/attack-effects/:attackSizeId/:defenderSizeId', (req, res) => characterSizeController.findAttackEffects(req, res));

export { router as characterSizeRouter };
