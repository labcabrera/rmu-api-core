import { AuthenticatedCommand } from 'src/modules/shared/application/cqrs/authenticated-command';
import { MagicPresence } from 'src/modules/realms/domain/value-objects/realm-magic-type.vo';
import { AccessType } from 'src/modules/shared/domain/entities/access-type';

export class CreateRealmCommand extends AuthenticatedCommand {
  constructor(
    public readonly name: string,
    public readonly shortDescription: string | undefined,
    public readonly description: string | undefined,
    public readonly imageUrl: string | undefined,
    public readonly magicPresence: MagicPresence,
    public readonly accessType: AccessType,
    userId: string,
    roles: string[],
  ) {
    super(userId, roles);
  }
}
