import { Router } from 'express';
import { container } from '@shared/container';
import { TYPES } from '@shared/types/container';
import { ArmorTypeController } from '@infrastructure/adapters/controllers/armor-type-controller';

const router = Router();
const armorTypeController = container.get<ArmorTypeController>(TYPES.ArmorTypeController);

router.get('/', (req, res) => armorTypeController.findAll(req, res));
router.get('/:id', (req, res) => armorTypeController.findById(req, res));
router.post('/', (req, res) => armorTypeController.create(req, res));
router.put('/:id', (req, res) => armorTypeController.update(req, res));
router.delete('/:id', (req, res) => armorTypeController.deleteById(req, res));

export default router;
