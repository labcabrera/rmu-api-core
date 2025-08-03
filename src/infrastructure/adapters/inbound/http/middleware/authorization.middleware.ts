import { Request, Response, NextFunction } from 'express';
import '../../../../types/express'; // Importar las extensiones de tipos

export interface AuthorizationOptions {
  roles?: string[];
  groups?: string[];
  requireAll?: boolean; // true = requiere TODOS los roles/grupos, false = requiere AL MENOS UNO
}

export class AuthorizationMiddleware {
  public static requireRoles(roles: string[], requireAll: boolean = false) {
    return (req: Request, res: Response, next: NextFunction) => {
      if (!req.user) {
        return res.status(401).json({
          message: 'User not authenticated',
          code: 'UNAUTHORIZED'
        });
      }

      const userRoles = req.user.roles;
      const hasRequiredRoles = requireAll
        ? roles.every(role => userRoles.includes(role))
        : roles.some(role => userRoles.includes(role));

      if (!hasRequiredRoles) {
        return res.status(403).json({
          message: `Access denied. Required roles: ${roles.join(', ')}`,
          code: 'FORBIDDEN',
          requiredRoles: roles,
          userRoles: userRoles
        });
      }

      next();
    };
  }

  public static requireGroups(groups: string[], requireAll: boolean = false) {
    return (req: Request, res: Response, next: NextFunction) => {
      if (!req.user) {
        return res.status(401).json({
          message: 'User not authenticated',
          code: 'UNAUTHORIZED'
        });
      }

      const userGroups = req.user.groups;
      const hasRequiredGroups = requireAll
        ? groups.every(group => userGroups.includes(group))
        : groups.some(group => userGroups.includes(group));

      if (!hasRequiredGroups) {
        return res.status(403).json({
          message: `Access denied. Required groups: ${groups.join(', ')}`,
          code: 'FORBIDDEN',
          requiredGroups: groups,
          userGroups: userGroups
        });
      }

      next();
    };
  }

  public static requireAuth(options?: AuthorizationOptions) {
    return (req: Request, res: Response, next: NextFunction) => {
      if (!req.user) {
        return res.status(401).json({
          message: 'User not authenticated',
          code: 'UNAUTHORIZED'
        });
      }

      if (!options) {
        return next(); // Solo requiere autenticación
      }

      const { roles, groups, requireAll = false } = options;

      // Verificar roles si se especifican
      if (roles && roles.length > 0) {
        const userRoles = req.user.roles;
        const hasRequiredRoles = requireAll
          ? roles.every(role => userRoles.includes(role))
          : roles.some(role => userRoles.includes(role));

        if (!hasRequiredRoles) {
          return res.status(403).json({
            message: `Access denied. Required roles: ${roles.join(', ')}`,
            code: 'FORBIDDEN',
            requiredRoles: roles,
            userRoles: userRoles
          });
        }
      }

      // Verificar grupos si se especifican
      if (groups && groups.length > 0) {
        const userGroups = req.user.groups;
        const hasRequiredGroups = requireAll
          ? groups.every(group => userGroups.includes(group))
          : groups.some(group => userGroups.includes(group));

        if (!hasRequiredGroups) {
          return res.status(403).json({
            message: `Access denied. Required groups: ${groups.join(', ')}`,
            code: 'FORBIDDEN',
            requiredGroups: groups,
            userGroups: userGroups
          });
        }
      }

      next();
    };
  }
}
