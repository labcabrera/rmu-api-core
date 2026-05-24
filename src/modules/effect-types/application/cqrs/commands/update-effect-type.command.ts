import { AuthenticatedCommand } from 'src/modules/shared/application/cqrs/authenticated-command';
import { AccessType } from 'src/modules/shared/domain/entities/access-type';
import { EffectPropertyRequirement } from 'src/modules/effect-types/domain/value-objects/effect-property-requirement.vo';

export class UpdateEffectTypeCommand extends AuthenticatedCommand {
  constructor(
    public readonly id: string,
    public readonly isPersistent: boolean | undefined,
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
