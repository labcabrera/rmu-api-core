import { AuthenticatedCommand } from 'src/modules/shared/application/cqrs/authenticated-command';
import { MagicPresence } from 'src/modules/realms/domain/value-objects/realm-magic-type.vo';
import { AccessType } from 'src/modules/shared/domain/entities/access-type';

export class UpdateRealmCommand extends AuthenticatedCommand {
  constructor(
    public readonly id: string,
    public readonly name: string | undefined,
    public readonly magicPresence: MagicPresence | undefined,
    public readonly shortDescription: string | undefined,
    public readonly description: string | undefined,
    public readonly imageUrl: string | undefined,
    public readonly accessType: AccessType | undefined,
    userId: string,
    roles: string[],
  ) {
    super(userId, roles);
  }
}
