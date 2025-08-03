import { Router } from 'express';
import { container } from '@shared/container';
import { SkillCategoryController } from '../controllers/skill-category.controller';

const router = Router();
const skillCategoryController = container.get<SkillCategoryController>('SkillCategoryController');

router.get('/', (req, res) => skillCategoryController.find(req, res));
router.get('/:id', (req, res) => skillCategoryController.findById(req, res));

export { router as skillCategoryRouter };
