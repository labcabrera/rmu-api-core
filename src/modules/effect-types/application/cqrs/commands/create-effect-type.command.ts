import { AuthenticatedCommand } from '../../../../shared/application/cqrs/authenticated-command.js';
import type { AccessType } from '../../../../shared/domain/entities/access-type.js';
import type { EffectPropertyRequirement } from '../../../domain/value-objects/effect-property-requirement.vo.js';
import type { EntitySource } from '../../../../shared/domain/entities/entity-source.js';

export class CreateEffectTypeCommand extends AuthenticatedCommand {
  constructor(
    public readonly id: string,
    public readonly isPersistent: boolean,
    public readonly isStackable: boolean,
    public readonly value: EffectPropertyRequirement,
    public readonly modifier: EffectPropertyRequirement,
    public readonly rounds: EffectPropertyRequirement,
    public readonly text: EffectPropertyRequirement,
    public readonly location: EffectPropertyRequirement,
    public readonly delay: EffectPropertyRequirement,
    public readonly accessType: AccessType,
    userId: string,
    roles: string[],
    /** Spec 063: only an admin asks for `system`; undefined is `user` on create and no change on update. */
    public readonly entitySource?: EntitySource,
  ) {
    super(userId, roles);
  }
}
