import { Router } from 'express';
import { container } from '@shared/container';
import { TYPES } from '@shared/types/container';
import { SkillCategoryController } from '@infrastructure/adapters/controllers/skill-category-controller';

const router = Router();
const skillCategoryController = container.get<SkillCategoryController>(TYPES.SkillCategoryController);

router.get('/', (req, res) => skillCategoryController.findAll(req, res));
router.get('/:id', (req, res) => skillCategoryController.findById(req, res));
router.post('/', (req, res) => skillCategoryController.create(req, res));
router.put('/:id', (req, res) => skillCategoryController.update(req, res));
router.delete('/:id', (req, res) => skillCategoryController.deleteById(req, res));

export default router;
