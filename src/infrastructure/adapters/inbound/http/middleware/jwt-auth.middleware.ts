import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';
import { JWTPayload, User } from '@domain/entities/auth';
import '../../../../types/express'; // Importar las extensiones de tipos

export class JWTAuthMiddleware {
  private jwksClient: jwksClient.JwksClient;
  private issuer: string;
  private audience: string;

  constructor(
    keycloakUrl: string,
    realm: string,
    clientId: string
  ) {
    this.issuer = `${keycloakUrl}/realms/${realm}`;
    this.audience = clientId;
    
    this.jwksClient = jwksClient({
      jwksUri: `${keycloakUrl}/realms/${realm}/protocol/openid-connect/certs`,
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
        
        // Decode the token header to get the kid
        const decodedHeader = jwt.decode(token, { complete: true });
        
        if (!decodedHeader || !decodedHeader.header.kid) {
          return res.status(401).json({
            message: 'Invalid token format',
            code: 'UNAUTHORIZED'
          });
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
        req.user = this.extractUserFromPayload(payload);
        
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
}
