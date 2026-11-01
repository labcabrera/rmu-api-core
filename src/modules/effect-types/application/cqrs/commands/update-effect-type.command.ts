import { AuthenticatedCommand } from '../../../../shared/application/cqrs/authenticated-command.js';
import type { AccessType } from '../../../../shared/domain/entities/access-type.js';
import type { EffectPropertyRequirement } from '../../../domain/value-objects/effect-property-requirement.vo.js';
import type { EntitySource } from '../../../../shared/domain/entities/entity-source.js';

export class UpdateEffectTypeCommand extends AuthenticatedCommand {
  constructor(
    public readonly id: string,
    public readonly isPersistent: boolean | undefined,
    public readonly isStackable: boolean | undefined,
    public readonly value: EffectPropertyRequirement | undefined,
    public readonly modifier: EffectPropertyRequirement | undefined,
    public readonly rounds: EffectPropertyRequirement | undefined,
    public readonly text: EffectPropertyRequirement | undefined,
    public readonly location: EffectPropertyRequirement | undefined,
    public readonly delay: EffectPropertyRequirement | undefined,
    public readonly accessType: AccessType | undefined,
    userId: string,
    roles: string[],
    /** The version the client read; undefined skips the concurrency check. */
    public readonly expectedVersion?: number,
    /** Spec 063: only an admin asks for `system`; undefined is `user` on create and no change on update. */
    public readonly entitySource?: EntitySource,
  ) {
    super(userId, roles);
  }
}
