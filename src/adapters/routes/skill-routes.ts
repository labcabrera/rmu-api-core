import { Router } from 'express';
import { container } from '@shared/container';
import { TYPES } from '@shared/types/container';
import { SkillController } from '@infrastructure/adapters/controllers/skill-controller';

const router = Router();
const skillController = container.get<SkillController>(TYPES.SkillController);

router.get('/', (req, res) => skillController.findAll(req, res));
router.get('/:id', (req, res) => skillController.findById(req, res));
router.post('/', (req, res) => skillController.create(req, res));
router.put('/:id', (req, res) => skillController.update(req, res));
router.delete('/:id', (req, res) => skillController.deleteById(req, res));

export default router;
