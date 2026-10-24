import { describe, expect, it, vi } from 'vitest';
import type { ExecutionContext } from '@nestjs/common';
import type { NestExpressApplication } from '@nestjs/platform-express';
import type { ThrottlerGuard } from '@nestjs/throttler';
import { configureHttp, splitList } from '../../../../src/bootstrap/http.js';
import { HttpThrottlerGuard } from '../../../../src/modules/shared/infrastructure/http/http-throttler.guard.js';

const fakeApp = (settings: Record<string, string>) => {
  const app = {
    get: () => ({ get: (key: string) => settings[key] }),
    set: vi.fn(),
    use: vi.fn(),
    enableCors: vi.fn(),
    enableShutdownHooks: vi.fn(),
    useGlobalPipes: vi.fn(),
    useGlobalFilters: vi.fn(),
  };
  return app;
};

describe('configureHttp', () => {
  it('splits a comma-separated list without blanks', () => {
    expect(splitList(' http://a.test, ,http://b.test ')).toEqual(['http://a.test', 'http://b.test']);
    expect(splitList(undefined)).toEqual([]);
  });

  it('trusts the proxy, adds the security headers and leaves CORS off without origins', () => {
    const app = fakeApp({ RMU_TRUST_PROXY: 'loopback', RMU_CORS_ORIGINS: '' });

    configureHttp(app as unknown as NestExpressApplication);

    expect(app.set).toHaveBeenCalledWith('trust proxy', 'loopback');
    expect(app.use).toHaveBeenCalledTimes(1);
    expect(app.enableCors).not.toHaveBeenCalled();
    expect(app.useGlobalPipes).toHaveBeenCalledTimes(1);
    expect(app.useGlobalFilters).toHaveBeenCalledTimes(1);
  });

  it('enables CORS for the configured origins only', () => {
    const app = fakeApp({ RMU_CORS_ORIGINS: 'http://a.test,http://b.test' });

    configureHttp(app as unknown as NestExpressApplication);

    expect(app.enableCors).toHaveBeenCalledWith({ origin: ['http://a.test', 'http://b.test'] });
  });
});

describe('HttpThrottlerGuard', () => {
  const shouldSkip = (type: string) =>
    (HttpThrottlerGuard.prototype as unknown as { shouldSkip(context: ExecutionContext): Promise<boolean> }).shouldSkip.call(
      {} as ThrottlerGuard,
      { getType: () => type } as ExecutionContext,
    );

  it('never limits the Kafka handlers', async () => {
    await expect(shouldSkip('rpc')).resolves.toBe(true);
  });
});
