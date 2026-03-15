import { AuthenticatedCommand } from 'src/modules/shared/application/cqrs/authenticated-command';
import { AccessType } from 'src/modules/shared/domain/entities/access-type';
import { SkillSpecialization } from 'src/modules/skills/domain/value-objects/skill-specialization.vo';

export class CreateSkillCommand extends AuthenticatedCommand {
  constructor(
    public readonly id: string,
    public readonly categoryId: string,
    public readonly bonus: string[],
    public readonly specialization: SkillSpecialization | null,
    public readonly accessType: AccessType,
    userId: string,
    roles: string[],
  ) {
    super(userId, roles);
  }
}
