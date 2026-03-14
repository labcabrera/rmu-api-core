import { AuthenticatedCommand } from 'src/modules/shared/application/cqrs/authenticated-command';
import { SkillSpecialization } from 'src/modules/skills/domain/value-objects/skill-specialization.vo';

export class CreateSkillCommand extends AuthenticatedCommand {
  constructor(
    public readonly id: string,
    public readonly categoryId: string,
    public readonly bonus: string[],
    public readonly specialization: SkillSpecialization | undefined,
    userId: string,
    roles: string[],
  ) {
    super(userId, roles);
  }
}
