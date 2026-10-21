import { AuthenticatedCommand } from '../../../../shared/application/cqrs/authenticated-command.js';
import type { AccessType } from '../../../../shared/domain/entities/access-type.js';
import type { EffectPropertyRequirement } from '../../../domain/value-objects/effect-property-requirement.vo.js';

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
  ) {
    super(userId, roles);
  }
}
