import { User } from '@domain/entities/auth';

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

export {};
