import { EnumerationCategory } from '../../../domain/value-objects/enumeration-category.vo';
import { AuthenticatedCommand } from '../../../../shared/application/cqrs/authenticated-command';
import { AccessType } from '../../../../shared/domain/entities/access-type';

export class CreateEnumerationCommand extends AuthenticatedCommand {
  constructor(
    public readonly key: string,
    public readonly category: EnumerationCategory,
    public readonly realmId: string | null,
    public readonly description: string | null,
    public readonly imageUrl: string | null,
    public readonly accessType: AccessType,
    userId: string,
    roles: string[],
  ) {
    super(userId, roles);
  }
}
