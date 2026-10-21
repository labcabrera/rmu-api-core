import type { AccessType } from '../../../../shared/domain/entities/access-type.js';

export class UpdateRaceRealmNameCommand {
  constructor(
    public readonly realmId: string,
    public readonly realmName: string,
    public readonly realmOwner: string,
    public readonly realmAccessType: AccessType,
  ) {}
}
