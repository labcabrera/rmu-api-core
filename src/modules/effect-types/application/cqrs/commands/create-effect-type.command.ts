import { AuthenticatedCommand } from 'src/modules/shared/application/cqrs/authenticated-command';
import { AccessType } from 'src/modules/shared/domain/entities/access-type';
import { EffectPropertyRequirement } from 'src/modules/effect-types/domain/value-objects/effect-property-requirement.vo';

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
  ) {
    super(userId, roles);
  }
}
