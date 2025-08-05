import { Request, Response } from 'express';
import { injectable } from 'inversify';

@injectable()
export class HealthController {
  async getHealth(req: Request, res: Response): Promise<void> {
    const checks = {
      database: await this.checkDatabase(),
      keycloak: await this.checkKeycloak(),
    };
    const allHealthy = Object.values(checks).every(check => check.healthy);
    const health = {
      status: allHealthy ? 'ok' : 'error',
      checks: checks,
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: process.env.npm_package_version || '0.0.0',
      environment: process.env.NODE_ENV || 'development',
    };
    res.status(allHealthy ? 200 : 503).json(health);
  }

  private async checkDatabase(): Promise<{ healthy: boolean; message: string }> {
    // Implementar check de DB
    return { healthy: true, message: 'Connected' };
  }

  private async checkKeycloak(): Promise<{ healthy: boolean; message: string }> {
    // Implementar check de Keycloak
    return { healthy: true, message: 'Connected' };
  }
}
