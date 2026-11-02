import type { AccessType } from '../../../../shared/domain/entities/access-type.js';

/** System command: copies a realm's owner and access type to its races when the realm changes. */
export class SyncRaceRealmCommand {
  constructor(
    public readonly realmId: string,
    public readonly realmName: string,
    public readonly realmOwner: string,
    public readonly realmAccessType: AccessType,
  ) {}
}
