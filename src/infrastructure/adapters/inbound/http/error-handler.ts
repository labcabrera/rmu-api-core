import { DomainError } from '@domain/errors/errors';
import { Request, Response } from 'express';

export const errorHandler = (error: Error, req: Request, res: Response): void => {
  console.error('Error handler:', error);

  if (error instanceof DomainError) {
    res.status(error.statusCode).json({
      message: error.message,
      code: error.code,
    });
    return;
  }

  res.status(500).json({
    message: 'Internal Server Error',
    code: 'INTERNAL_ERROR',
  });
};
