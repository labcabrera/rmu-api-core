import { Router } from 'express';
import { container } from '@shared/container';
import { RealmController } from '@infrastructure/adapters/inbound/http/controllers/realm-controller';

const router = Router();
const realmController = container.get<RealmController>('RealmController');

router.get('/', (req, res, next) => realmController.findAll(req, res, next));
router.get('/:id', (req, res, next) => realmController.findById(req, res, next));
router.post('/', (req, res, next) => realmController.create(req, res, next));
router.put('/:id', (req, res, next) => realmController.update(req, res, next));
router.delete('/:id', (req, res, next) => realmController.deleteById(req, res, next));

export { router as realmRouter };
