import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';
import { injectable, inject } from 'inversify';
import { JWTPayload, User } from '@domain/entities/auth';

export interface AuthConfig {
  keycloakUrl: string;
  realm: string;
  clientId: string;
}

@injectable()
export class AuthService {
  private jwksClient: jwksClient.JwksClient;
  private issuer: string;
  private audience: string;

  constructor(@inject('AuthConfig') config: AuthConfig) {
    this.issuer = `${config.keycloakUrl}/realms/${config.realm}`;
    this.audience = config.clientId;
    
    this.jwksClient = jwksClient({
      jwksUri: `${config.keycloakUrl}/realms/${config.realm}/protocol/openid-connect/certs`,
      requestHeaders: {},
      timeout: 30000,
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
      cacheMaxEntries: 5,
      cacheMaxAge: 600000, // 10 minutes
    });
  }

  private async getKey(header: jwt.JwtHeader): Promise<string> {
    return new Promise((resolve, reject) => {
      this.jwksClient.getSigningKey(header.kid!, (err, key) => {
        if (err) {
          reject(err);
        } else {
          const signingKey = key!.getPublicKey();
          resolve(signingKey);
        }
      });
    });
  }

  private extractUserFromPayload(payload: JWTPayload): User {
    const realmRoles = payload.realm_access?.roles || [];
    const clientRoles = Object.values(payload.resource_access || {})
      .flatMap(client => client.roles);
    
    return {
      id: payload.sub,
      username: payload.preferred_username || payload.sub,
      email: payload.email || '',
      firstName: payload.given_name,
      lastName: payload.family_name,
      roles: [...realmRoles, ...clientRoles],
      groups: payload.groups || [],
      realm: payload.iss.split('/').pop() || 'unknown'
    };
  }

  public async verifyToken(token: string): Promise<User> {
    // Decode the token header to get the kid
    const decodedHeader = jwt.decode(token, { complete: true });
    
    if (!decodedHeader || !decodedHeader.header.kid) {
      throw new Error('Invalid token format');
    }

    // Get the signing key
    const signingKey = await this.getKey(decodedHeader.header);
    
    // Verify and decode the token
    const payload = jwt.verify(token, signingKey, {
      issuer: this.issuer,
      audience: this.audience,
      algorithms: ['RS256']
    }) as JWTPayload;

    // Extract user information
    return this.extractUserFromPayload(payload);
  }

  public middleware() {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
          return res.status(401).json({
            message: 'Authorization header missing or invalid',
            code: 'UNAUTHORIZED'
          });
        }

        const token = authHeader.substring(7); // Remove "Bearer "
        const user = await this.verifyToken(token);
        
        // Agregar el usuario al request usando any para evitar problemas de tipos
        (req as any).user = user;
        
        next();
      } catch (error) {
        console.error('JWT verification error:', error);
        
        if (error instanceof jwt.TokenExpiredError) {
          return res.status(401).json({
            message: 'Token expired',
            code: 'TOKEN_EXPIRED'
          });
        }
        
        if (error instanceof jwt.JsonWebTokenError) {
          return res.status(401).json({
            message: 'Invalid token',
            code: 'INVALID_TOKEN'
          });
        }
        
        return res.status(500).json({
          message: 'Internal server error during authentication',
          code: 'AUTH_ERROR'
        });
      }
    };
  }

  public static requireRoles(roles: string[], requireAll: boolean = false) {
    return (req: Request, res: Response, next: NextFunction) => {
      const user = (req as any).user as User;
      
      if (!user) {
        return res.status(401).json({
          message: 'User not authenticated',
          code: 'UNAUTHORIZED'
        });
      }

      const userRoles = user.roles;
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
      const user = (req as any).user as User;
      
      if (!user) {
        return res.status(401).json({
          message: 'User not authenticated',
          code: 'UNAUTHORIZED'
        });
      }

      const userGroups = user.groups;
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
}
