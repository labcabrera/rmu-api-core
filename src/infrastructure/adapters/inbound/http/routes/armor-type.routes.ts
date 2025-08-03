import { Router } from 'express';
import { container } from '@shared/container';
import { TYPES } from '@shared/container';
import { ArmorTypeController } from '@infrastructure/adapters/inbound/http/controllers/armor-type-controller';

const router = Router();
const armorTypeController = container.get<ArmorTypeController>(TYPES.ArmorTypeController);

router.get('/', (req, res) => armorTypeController.findAll(req, res));
router.get('/:id', (req, res) => armorTypeController.findById(req, res));

export { router as armorTypeRouter };
