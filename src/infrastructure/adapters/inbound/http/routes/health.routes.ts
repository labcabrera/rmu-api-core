import { Router } from 'express';
import { container } from '@shared/container';
import { HealthController } from '../controllers/health.controller';

const router = Router();
const healthController = container.get<HealthController>('HealthController');

router.get('/', (req, res) => healthController.getHealth(req, res));

export { router as healthRouter };
