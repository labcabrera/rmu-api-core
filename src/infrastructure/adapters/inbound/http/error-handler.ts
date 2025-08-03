import { DomainError } from '@domain/errors/errors';
import { Request, Response, NextFunction } from 'express';

export const errorHandler = (error: Error, req: Request, res: Response, next: NextFunction): void => {
  console.error('Error handler caught:', {
    name: error.name,
    message: error.message,
    url: req.url,
    method: req.method
  });

  if (res.headersSent) {
    console.error('Headers already sent, delegating to default Express error handler');
    return next(error);
  }

  if (error instanceof DomainError) {
    console.log(`Domain error: ${error.constructor.name} - Status: ${error.statusCode}`);
    res.status(error.statusCode).json({
      message: error.message,
      timestamp: new Date().toISOString(),
    });
    return;
  }

  console.error('Unhandled error:', error);
  res.status(500).json({
    message: 'Internal Server Error',
    timestamp: new Date().toISOString(),
    details: error.message,
    stack:  error.stack,
  });
};
