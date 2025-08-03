import { Request } from 'express';
import { User } from '@domain/entities/auth';

// Helper para acceder al usuario en el request
export function getAuthenticatedUser(req: Request): User | undefined {
  return (req as any).user;
}

// Helper para verificar si el usuario está autenticado
export function isAuthenticated(req: Request): boolean {
  return !!(req as any).user;
}
