import { Router } from 'express';
import { container } from '@shared/container';
import { TYPES } from '@shared/types/container';
import { ArmorTypeController } from '@infrastructure/adapters/controllers/ArmorTypeController';

const router = Router();
const armorTypeController = container.get<ArmorTypeController>(TYPES.ArmorTypeController);

// GET /v1/armor-types
router.get('/', (req, res) => armorTypeController.findAll(req, res));

// GET /v1/armor-types/:id
router.get('/:id', (req, res) => armorTypeController.findById(req, res));

// POST /v1/armor-types
router.post('/', (req, res) => armorTypeController.create(req, res));

// PUT /v1/armor-types/:id
router.put('/:id', (req, res) => armorTypeController.update(req, res));

// DELETE /v1/armor-types/:id
router.delete('/:id', (req, res) => armorTypeController.deleteById(req, res));

export default router;
