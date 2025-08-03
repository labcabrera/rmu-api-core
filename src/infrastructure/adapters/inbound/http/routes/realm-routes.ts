import { Router } from 'express';
import { container } from '@shared/container';
import { RealmController } from '@infrastructure/adapters/inbound/http/controllers/realm-controller';
import { asyncHandler } from '../async-handler';

const router = Router();
const realmController = container.get<RealmController>('RealmController');

router.get(
  '/',
  asyncHandler(async (req, res, next) => await realmController.findAll(req, res, next))
);
router.get(
  '/:id',
  asyncHandler(async (req, res, next) => await realmController.findById(req, res, next))
);
router.post(
  '/',
  asyncHandler(async (req, res, next) => await realmController.create(req, res, next))
);
router.put(
  '/:id',
  asyncHandler(async (req, res, next) => await realmController.update(req, res, next))
);
router.delete(
  '/:id',
  asyncHandler(async (req, res, next) => await realmController.deleteById(req, res, next))
);

export { router as realmRouter };
