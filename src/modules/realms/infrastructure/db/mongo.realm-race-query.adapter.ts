import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import type { Connection } from 'mongoose';
import type { RealmRaceQueryPort } from '../../application/ports/realm-race-query.port.js';

/** Counts on the `races` collection (indexed by realmId) without depending on the races module code. */
@Injectable()
export class MongoRealmRaceQueryAdapter implements RealmRaceQueryPort {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  async countSystemRaces(realmId: string): Promise<number> {
    return await this.connection.collection('races').countDocuments({ realmId, entitySource: 'system' });
  }
}
