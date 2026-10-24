import type { EnumerationCategory } from '../../../domain/value-objects/enumeration-category.vo.js';
import { AuthenticatedCommand } from '../../../../shared/application/cqrs/authenticated-command.js';
import type { AccessType } from '../../../../shared/domain/entities/access-type.js';

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
    /** The version the client read; undefined skips the concurrency check. */
    public readonly expectedVersion?: number,
  ) {
    super(userId, roles);
  }
}
