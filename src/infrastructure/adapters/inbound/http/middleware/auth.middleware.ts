import { Request, Response, NextFunction } from 'express';
import { container } from '@shared/container';
import { AuthService } from '@infrastructure/adapters/inbound/http/services/auth.service';

// Factory function para crear el middleware de autenticación
export function createAuthMiddleware() {
  const authService = container.get<AuthService>('AuthService');
  return authService.middleware();
}

// Factory functions para crear middlewares de autorización
export function requireRoles(roles: string[], requireAll: boolean = false) {
  return AuthService.requireRoles(roles, requireAll);
}

export function requireGroups(groups: string[], requireAll: boolean = false) {
  return AuthService.requireGroups(groups, requireAll);
}

// Middleware combinado que requiere autenticación
export function requireAuth() {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    
    if (!user) {
      return res.status(401).json({
        message: 'Authentication required',
        code: 'UNAUTHORIZED'
      });
    }
    
    next();
  };
}
