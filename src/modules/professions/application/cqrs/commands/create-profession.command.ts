import { ProfessionSkillCosts } from 'src/modules/professions/domain/value-objects/profession-skill-cost.vo';
import { RealmType } from 'src/modules/professions/domain/value-objects/realm-type.vo';

export class CreateProfessionCommand {
  constructor(
    public readonly id: string,
    public readonly availableRealmTypes: RealmType[],
    public readonly fixedRealmTypes: RealmType[],
    public readonly skillCosts: ProfessionSkillCosts,
    public readonly professionalSkills: string[],
    public readonly description: string | undefined,
    public readonly imageUrl: string | undefined,
    public readonly userId: string,
    public readonly roles: string[],
  ) {}
}
