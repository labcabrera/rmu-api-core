import { ProfessionSkillCosts } from 'src/modules/professions/domain/value-objects/profession-skill-cost.vo';

export class CreateProfessionCommand {
  constructor(
    public readonly id: string,
    public readonly skillCosts: ProfessionSkillCosts,
    public readonly professionalSkills: string[],
    public readonly description: string,
    public readonly userId: string,
    public readonly roles: string[],
  ) {}
}
