import type { ProfessionSkillCosts } from '../value-objects/profession-skill-cost.vo.js';
import type { RealmType } from '../value-objects/realm-type.vo.js';
import type { ProfessionArchetype } from '../value-objects/profession-archetype.vo.js';
import type { EntitySource } from '../../../shared/domain/entities/entity-source.js';
import type { AccessType } from '../../../shared/domain/entities/access-type.js';

export interface ProfessionProps {
  id: string;
  archetype: ProfessionArchetype;
  availableRealmTypes: RealmType[];
  fixedRealmTypes: RealmType[];
  skillCosts: ProfessionSkillCosts;
  professionalSkills: string[];
  entitySource: EntitySource;
  description: string | undefined;
  imageUrl: string | undefined;
  owner: string;
  accessType: AccessType;
  createdAt: Date;
  updatedAt?: Date;
}
