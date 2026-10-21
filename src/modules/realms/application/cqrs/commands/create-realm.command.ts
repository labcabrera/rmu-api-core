import { AuthenticatedCommand } from '../../../../shared/application/cqrs/authenticated-command.js';
import type { MagicPresence } from '../../../domain/value-objects/realm-magic-type.vo.js';
import type { AccessType } from '../../../../shared/domain/entities/access-type.js';

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
