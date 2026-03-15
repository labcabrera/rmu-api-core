import { AccessType } from 'src/modules/shared/domain/entities/access-type';

export class UpdateLanguageRealmCommand {
  constructor(
    public readonly realmId: string,
    public readonly realmName: string,
    public readonly owner: string,
    public readonly accessType: AccessType,
  ) {}
}
