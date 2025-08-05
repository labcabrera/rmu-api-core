import { Router } from 'express';
import { container } from '@shared/container';
import { SkillController } from '@infrastructure/adapters/inbound/web/controllers/skill-controller';

const router = Router();
const skillController = container.get<SkillController>('SkillController');

router.get('/', (req, res) => skillController.find(req, res));
router.get('/:id', (req, res) => skillController.findById(req, res));

export { router as skillRouter };
