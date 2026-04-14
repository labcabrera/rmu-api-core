import { AuthenticatedCommand } from 'src/modules/shared/application/cqrs/authenticated-command';
import { AccessType } from 'src/modules/shared/domain/entities/access-type';

export class CreateCultureCommand extends AuthenticatedCommand {
  constructor(
    public readonly name: string,
    public readonly description: string | null,
    public readonly imageUrl: string | null,
    public readonly accessType: AccessType,
    userId: string,
    roles: string[],
  ) {
    super(userId, roles);
  }
}
