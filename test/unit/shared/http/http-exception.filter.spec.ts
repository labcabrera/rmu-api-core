import { describe, expect, it, vi } from 'vitest';
import { type ArgumentsHost, BadRequestException, Logger, ServiceUnavailableException, UnauthorizedException } from '@nestjs/common';
import { HttpExceptionFilter } from '../../../../src/modules/shared/interfaces/http/http-exception.filter.js';
import { NotFoundError } from '../../../../src/modules/shared/domain/errors/errors.js';

const run = (exception: unknown) => {
  const json = vi.fn();
  const status = vi.fn(() => ({ json }));
  const host = {
    switchToHttp: () => ({
      getRequest: () => ({ method: 'GET', originalUrl: '/v1/races/1' }),
      getResponse: () => ({ status }),
    }),
  } as unknown as ArgumentsHost;
  vi.spyOn(Logger.prototype, 'warn').mockImplementation(() => undefined);
  const error = vi.spyOn(Logger.prototype, 'error').mockImplementation(() => undefined);
  new HttpExceptionFilter().catch(exception, host);
  const [[code]] = status.mock.calls as unknown as [[number]];
  const [[body]] = json.mock.calls as unknown as [[Record<string, unknown>]];
  return { code, body, error };
};

class MongoServerError extends Error {
  readonly name = 'MongoServerError';
  readonly code = 11000;
  readonly keyValue = { key: 'westron' };
}

describe('HttpExceptionFilter', () => {
  it.each([
    ['a domain error', new NotFoundError('Race', '1'), 404, 'NotFoundError', 'Race 1 not found'],
    ['a validation error', new BadRequestException(['name should not be empty']), 400, 'BadRequestException', ['name should not be empty']],
    ['a guard rejection', new UnauthorizedException(), 401, 'UnauthorizedException', 'Unauthorized'],
    ['a duplicate key', new MongoServerError('E11000'), 409, 'ConflictError', 'Duplicate key {"key":"westron"}'],
    ['an unexpected error', new TypeError('x is undefined'), 500, 'InternalServerError', 'Internal server error'],
  ])('maps %s to one error format', (_, exception, statusCode, error, message) => {
    const { code, body } = run(exception);

    expect(code).toBe(statusCode);
    expect(body).toEqual({ statusCode, error, message, timestamp: expect.any(String) as unknown, path: '/v1/races/1' });
  });

  it('logs unexpected errors with their stack, without exposing them', () => {
    const { error, body } = run(new TypeError('x is undefined'));

    expect(error).toHaveBeenCalledWith('GET /v1/races/1: 500', expect.stringContaining('TypeError: x is undefined'));
    expect(JSON.stringify(body)).not.toContain('x is undefined');
  });

  it('sends a health report untouched', () => {
    const report = { status: 'error', info: {}, error: { mongodb: { status: 'down' } }, details: {} };

    const { code, body } = run(new ServiceUnavailableException(report));

    expect(code).toBe(503);
    expect(body).toEqual(report);
  });
});
