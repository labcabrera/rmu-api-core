import { container } from '@shared/container';
import { AuthService } from '@infrastructure/adapters/inbound/http/security/auth.service';

export function createAuthMiddleware() {
  const authService = container.get<AuthService>('AuthService');
  return authService.middleware();
}

/**
 * Middleware factory that requires specific roles
 */
export function requireRoles(roles: string[], requireAll: boolean = false) {
  return AuthService.requireRoles(roles, requireAll);
}
