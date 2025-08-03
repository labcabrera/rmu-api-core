import { Request, Response } from 'express';
import { injectable } from 'inversify';
import { getAuthenticatedUser } from '@infrastructure/adapters/inbound/http/utils/auth.utils';

@injectable()
export class AuthExampleController {
  // Endpoint público - no requiere autenticación
  public async publicEndpoint(req: Request, res: Response): Promise<void> {
    res.json({
      message: 'This is a public endpoint',
      timestamp: new Date().toISOString(),
    });
  }

  // Endpoint que requiere autenticación
  public async protectedEndpoint(req: Request, res: Response): Promise<void> {
    const user = getAuthenticatedUser(req);

    res.json({
      message: 'This is a protected endpoint',
      user: {
        id: user?.id,
        username: user?.username,
        email: user?.email,
        roles: user?.roles,
        groups: user?.groups,
        realm: user?.realm,
      },
      timestamp: new Date().toISOString(),
    });
  }

  // Endpoint que requiere rol de admin
  public async adminOnlyEndpoint(req: Request, res: Response): Promise<void> {
    const user = getAuthenticatedUser(req);

    res.json({
      message: 'This endpoint is only for admins',
      user: {
        username: user?.username,
        roles: user?.roles,
      },
      timestamp: new Date().toISOString(),
    });
  }

  // Endpoint que requiere múltiples roles
  public async superUserEndpoint(req: Request, res: Response): Promise<void> {
    const user = getAuthenticatedUser(req);

    res.json({
      message: 'This endpoint requires multiple roles',
      user: {
        username: user?.username,
        roles: user?.roles,
        hasRequiredRoles: user?.roles.includes('admin') && user?.roles.includes('super-user'),
      },
      timestamp: new Date().toISOString(),
    });
  }

  // Endpoint que requiere grupo específico
  public async managersOnlyEndpoint(req: Request, res: Response): Promise<void> {
    const user = getAuthenticatedUser(req);

    res.json({
      message: 'This endpoint is only for managers group',
      user: {
        username: user?.username,
        groups: user?.groups,
      },
      timestamp: new Date().toISOString(),
    });
  }

  // Endpoint que muestra información del token
  public async tokenInfo(req: Request, res: Response): Promise<void> {
    const user = getAuthenticatedUser(req);

    if (!user) {
      res.status(401).json({
        message: 'No user information available',
        authenticated: false,
      });
      return;
    }

    res.json({
      message: 'Token information',
      authenticated: true,
      tokenInfo: {
        userId: user.id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        realm: user.realm,
        roles: user.roles,
        groups: user.groups,
        totalRoles: user.roles.length,
        totalGroups: user.groups.length,
      },
      timestamp: new Date().toISOString(),
    });
  }
}
