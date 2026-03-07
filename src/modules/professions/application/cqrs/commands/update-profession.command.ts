import { ProfessionSkillCosts } from 'src/modules/professions/domain/value-objects/profession-skill-cost.vo';

export class UpdateProfessionCommand {
  constructor(
    public readonly id: string,
    public readonly skillCosts: ProfessionSkillCosts | undefined,
    public readonly professionalSkills: string[] | undefined,
    public readonly description: string | undefined,
    public readonly imageUrl: string | undefined,
    public readonly userId: string,
    public readonly roles: string[],
  ) {}
}
