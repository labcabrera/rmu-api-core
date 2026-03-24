import { EnumerationCategory } from 'src/modules/enumerations/domain/value-objects/enumeration-category.vo';
import { AuthenticatedCommand } from 'src/modules/shared/application/cqrs/authenticated-command';
import { AccessType } from 'src/modules/shared/domain/entities/access-type';

export class UpdateEnumerationCommand extends AuthenticatedCommand {
  constructor(
    public readonly id: string,
    public readonly key: string | undefined,
    public readonly category: EnumerationCategory | undefined,
    public readonly realmId: string | null | undefined,
    public readonly description: string | null | undefined,
    public readonly imageUrl: string | null | undefined,
    public readonly accessType: AccessType | undefined,
    userId: string,
    roles: string[],
  ) {
    super(userId, roles);
  }
}
