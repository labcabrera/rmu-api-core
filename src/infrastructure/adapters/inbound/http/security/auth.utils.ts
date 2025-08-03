import { Request } from 'express';
import { User } from '@domain/entities/auth';

export function getAuthenticatedUser(req: Request): User | undefined {
  return (req as any).user;
}

export function isAuthenticated(req: Request): boolean {
  return !!(req as any).user;
}
