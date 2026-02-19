import { SkillSpecialization } from 'src/modules/skills/domain/value-objects/skill-specialization.vo';

export class CreateSkillCommand {
  constructor(
    public readonly id: string,
    public readonly categoryId: string,
    public readonly bonus: string[],
    public readonly specialization: SkillSpecialization | undefined,
    public readonly userId: string,
    public readonly roles?: string[],
  ) {}
}
