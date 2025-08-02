import { Router } from 'express';
import { container } from '@shared/container';
import { TYPES } from '@shared/types/container';
import { SkillController } from '@infrastructure/adapters/controllers/SkillController';

const router = Router();
const skillController = container.get<SkillController>(TYPES.SkillController);

// GET /v1/skills
router.get('/', (req, res) => skillController.findAll(req, res));

// GET /v1/skills/:id
router.get('/:id', (req, res) => skillController.findById(req, res));

// POST /v1/skills
router.post('/', (req, res) => skillController.create(req, res));

// PUT /v1/skills/:id
router.put('/:id', (req, res) => skillController.update(req, res));

// DELETE /v1/skills/:id
router.delete('/:id', (req, res) => skillController.deleteById(req, res));

export { router as skillRouter };
