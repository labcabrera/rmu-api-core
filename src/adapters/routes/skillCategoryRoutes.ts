import { Router } from 'express';
import { container } from '@shared/container';
import { TYPES } from '@shared/types/container';
import { SkillCategoryController } from '@infrastructure/adapters/controllers/SkillCategoryController';

const router = Router();
const skillCategoryController = container.get<SkillCategoryController>(TYPES.SkillCategoryController);

// GET /v1/skill-categories
router.get('/', (req, res) => skillCategoryController.findAll(req, res));

// GET /v1/skill-categories/:id
router.get('/:id', (req, res) => skillCategoryController.findById(req, res));

// POST /v1/skill-categories
router.post('/', (req, res) => skillCategoryController.create(req, res));

// PUT /v1/skill-categories/:id
router.put('/:id', (req, res) => skillCategoryController.update(req, res));

// DELETE /v1/skill-categories/:id
router.delete('/:id', (req, res) => skillCategoryController.deleteById(req, res));

export default router;
