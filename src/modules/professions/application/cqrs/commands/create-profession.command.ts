import type { ProfessionArchetype } from '../../../domain/value-objects/profession-archetype.vo.js';
import type { ProfessionSkillCosts } from '../../../domain/value-objects/profession-skill-cost.vo.js';
import type { RealmType } from '../../../domain/value-objects/realm-type.vo.js';
import { AuthenticatedCommand } from '../../../../shared/application/cqrs/authenticated-command.js';
import type { AccessType } from '../../../../shared/domain/entities/access-type.js';

export class CreateProfessionCommand extends AuthenticatedCommand {
  constructor(
    public readonly id: string,
    public readonly archetype: ProfessionArchetype,
    public readonly availableRealmTypes: RealmType[],
    public readonly fixedRealmTypes: RealmType[],
    public readonly skillCosts: ProfessionSkillCosts,
    public readonly professionalSkills: string[],
    public readonly description: string | undefined,
    public readonly imageUrl: string | undefined,
    public readonly accessType: AccessType,
    userId: string,
    roles: string[],
  ) {
    super(userId, roles);
  }
}
