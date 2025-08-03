import { Router } from 'express';
import { container } from '@shared/container';
import { CharacterSizeController } from '@infrastructure/adapters/inbound/http/controllers/character-size-controller';

const router = Router();
const characterSizeController = container.get<CharacterSizeController>('CharacterSizeController');

router.get('/', (req, res) => characterSizeController.find(req, res));
router.get('/:id', (req, res) => characterSizeController.findById(req, res));

export { router as characterSizeRouter };
