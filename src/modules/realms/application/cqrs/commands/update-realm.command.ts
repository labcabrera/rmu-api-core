import { AuthenticatedCommand } from '../../../../shared/application/cqrs/authenticated-command.js';
import type { MagicPresence } from '../../../domain/value-objects/realm-magic-type.vo.js';
import type { AccessType } from '../../../../shared/domain/entities/access-type.js';

export class UpdateRealmCommand extends AuthenticatedCommand {
  constructor(
    public readonly id: string,
    public readonly name: string | undefined,
    public readonly magicPresence: MagicPresence | undefined,
    public readonly shortDescription: string | null | undefined,
    public readonly description: string | null | undefined,
    public readonly imageUrl: string | null | undefined,
    public readonly accessType: AccessType | undefined,
    userId: string,
    roles: string[],
  ) {
    super(userId, roles);
  }
}
