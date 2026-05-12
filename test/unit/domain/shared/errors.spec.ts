import { describe, expect, it } from '@jest/globals';
import {
  BadGatewayError,
  ConflictError,
  DomainError,
  ForbiddenError,
  InvalidSearchExpression,
  NotFoundError,
  NotModifiedError,
  UnauthorizedError,
  ValidationError,
} from 'src/modules/shared/domain/errors/errors';

describe('domain errors', () => {
  it('creates a generic domain error with default status code', () => {
    const error = new DomainError('Unexpected domain failure');

    expect(error).toBeInstanceOf(Error);
    expect(error.name).toBe('DomainError');
    expect(error.message).toBe('Unexpected domain failure');
    expect(error.statusCode).toBe(500);
  });

  it.each([
    {
      error: new NotFoundError('Realm', 'realm-1'),
      name: 'NotFoundError',
      message: 'Realm realm-1 not found',
      statusCode: 404,
    },
    { error: new ConflictError('Already exists'), name: 'ConflictError', message: 'Already exists', statusCode: 409 },
    { error: new NotModifiedError('No changes'), name: 'NotModifiedError', message: 'No changes', statusCode: 304 },
    { error: new ValidationError('Invalid input'), name: 'ValidationError', message: 'Invalid input', statusCode: 400 },
    {
      error: new InvalidSearchExpression('Bad query'),
      name: 'InvalidSearchExpression',
      message: 'Bad query',
      statusCode: 400,
    },
    { error: new UnauthorizedError('Missing token'), name: 'UnauthorizedError', message: 'Missing token', statusCode: 401 },
    { error: new ForbiddenError('Forbidden'), name: 'ForbiddenError', message: 'Forbidden', statusCode: 403 },
    { error: new BadGatewayError('Gateway failed'), name: 'BadGatewayError', message: 'Gateway failed', statusCode: 502 },
  ])('maps $name to its domain name, message and status', ({ error, name, message, statusCode }) => {
    expect(error).toBeInstanceOf(DomainError);
    expect(error.name).toBe(name);
    expect(error.message).toBe(message);
    expect(error.statusCode).toBe(statusCode);
  });
});
