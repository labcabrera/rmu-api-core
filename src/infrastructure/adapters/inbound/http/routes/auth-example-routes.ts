import { Router } from 'express';
import { container } from '@shared/container';
import { AuthExampleController } from '../controllers/auth-example-controller';
import { asyncHandler } from '../async-handler';
import { createAuthMiddleware, requireRoles, requireGroups } from '../middleware/auth.middleware';

const router = Router();
const authExampleController = container.get<AuthExampleController>('AuthExampleController');

// Obtener instancia del middleware de autenticación
const authMiddleware = createAuthMiddleware();

// Endpoint público - sin autenticación
router.get(
  '/public',
  asyncHandler(async (req, res) => {
    await authExampleController.publicEndpoint(req, res);
  })
);

// Endpoint protegido - requiere autenticación
router.get(
  '/protected',
  authMiddleware,
  asyncHandler(async (req, res) => {
    await authExampleController.protectedEndpoint(req, res);
  })
);

// Endpoint solo para admins - requiere autenticación + rol 'admin'
router.get(
  '/admin-only',
  authMiddleware,
  requireRoles(['admin']),
  asyncHandler(async (req, res) => {
    await authExampleController.adminOnlyEndpoint(req, res);
  })
);

// Endpoint para super users - requiere autenticación + múltiples roles
router.get(
  '/super-user',
  authMiddleware,
  requireRoles(['admin', 'super-user'], true), // requireAll = true
  asyncHandler(async (req, res) => {
    await authExampleController.superUserEndpoint(req, res);
  })
);

// Endpoint para managers - requiere autenticación + grupo 'managers'
router.get(
  '/managers-only',
  authMiddleware,
  requireGroups(['managers']),
  asyncHandler(async (req, res) => {
    await authExampleController.managersOnlyEndpoint(req, res);
  })
);

// Endpoint para mostrar información del token
router.get(
  '/token-info',
  authMiddleware,
  asyncHandler(async (req, res) => {
    await authExampleController.tokenInfo(req, res);
  })
);

export { router as authExampleRouter };
