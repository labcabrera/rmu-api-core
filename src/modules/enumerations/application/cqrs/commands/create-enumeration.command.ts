import type { EnumerationCategory } from '../../../domain/value-objects/enumeration-category.vo.js';
import { AuthenticatedCommand } from '../../../../shared/application/cqrs/authenticated-command.js';
import type { AccessType } from '../../../../shared/domain/entities/access-type.js';
import type { EntitySource } from '../../../../shared/domain/entities/entity-source.js';

export class CreateEnumerationCommand extends AuthenticatedCommand {
  constructor(
    public readonly key: string,
    public readonly name: string,
    public readonly category: EnumerationCategory,
    public readonly realmId: string | null,
    public readonly description: string | null,
    public readonly imageUrl: string | null,
    public readonly accessType: AccessType,
    userId: string,
    roles: string[],
    /** Spec 063: only an admin asks for `system`; undefined is `user` on create and no change on update. */
    public readonly entitySource?: EntitySource,
  ) {
    super(userId, roles);
  }
}
