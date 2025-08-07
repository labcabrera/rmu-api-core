/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TokenService {
  private readonly logger = new Logger(TokenService.name);

  constructor(private readonly configService: ConfigService) {}

  private token: string | null = null;
  private expiresAt = 0;

  async getToken(): Promise<string> {
    const now = Date.now();
    if (this.token && now < this.expiresAt) return this.token;

    const uri = this.configService.get<string>('RMU_IAM_TOKEN_URI')!;
    let clientId = this.configService.get<string>('RMU_IAM_CLIENT_ID')!;
    let clientSecret = this.configService.get<string>('RMU_IAM_CLIENT_SECRET')!;

    //Local hack
    if (!this.configService.get<string>('NODE_ENV')) {
      clientId = 'rmu-user-client';
      clientSecret = 'jApYtJ4ZenWmytDHwlq1QKHC4EjUCvFJ';
    }

    this.logger.debug('Fetching new token env:', this.configService.get<string>('NODE_ENV'));
    this.logger.debug('Fetching new token from:', uri);
    this.logger.debug('Fetching new token clientId:', clientId);

    const params = new URLSearchParams();
    params.append('grant_type', 'client_credentials');
    params.append('client_id', clientId);
    params.append('client_secret', clientSecret);

    const { data } = await axios.post(uri, params, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    this.token = data.access_token;
    this.expiresAt = now + data.expires_in * 1000 - 10_000; // 10s offset

    return this.token!;
  }
}
