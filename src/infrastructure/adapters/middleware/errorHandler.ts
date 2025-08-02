import { Request, Response, NextFunction } from 'express';
import { DomainError } from '@shared/types';

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error('Error:', error);

  if (error instanceof DomainError) {
    res.status(error.statusCode).json({
      message: error.message,
      code: error.code,
    });
    return;
  }

  // Default error
  res.status(500).json({
    message: 'Internal Server Error',
    code: 'INTERNAL_ERROR',
  });
};
