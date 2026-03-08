import { ProfessionArchetype } from 'src/modules/professions/domain/value-objects/profession-archetype.vo';
import { ProfessionSkillCosts } from 'src/modules/professions/domain/value-objects/profession-skill-cost.vo';
import { RealmType } from 'src/modules/professions/domain/value-objects/realm-type.vo';

export class UpdateProfessionCommand {
  constructor(
    public readonly id: string,
    public readonly archetype: ProfessionArchetype | undefined,
    public readonly availableRealmTypes: RealmType[] | undefined,
    public readonly fixedRealmTypes: RealmType[] | undefined,
    public readonly skillCosts: ProfessionSkillCosts | undefined,
    public readonly professionalSkills: string[] | undefined,
    public readonly description: string | undefined,
    public readonly imageUrl: string | undefined,
    public readonly userId: string,
    public readonly roles: string[],
  ) {}
}
