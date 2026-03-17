import { EnumerationCategory } from 'src/modules/enumerations/domain/value-objects/enumeration-category.vo';
import { AuthenticatedCommand } from 'src/modules/shared/application/cqrs/authenticated-command';
import { AccessType } from 'src/modules/shared/domain/entities/access-type';

export class CreateEnumerationCommand extends AuthenticatedCommand {
  constructor(
    public readonly key: string,
    public readonly category: EnumerationCategory,
    public readonly realmId: string | null,
    public readonly accessType: AccessType,
    userId: string,
    roles: string[],
  ) {
    super(userId, roles);
  }
}
