import { ProfessionSkillCosts } from '../value-objects/profession-skill-cost.vo';
import { RealmType } from '../value-objects/realm-type.vo';
import { ProfessionArchetype } from '../value-objects/profession-archetype.vo';
import { EntitySource } from '../../../shared/domain/entities/entity-source';
import { AccessType } from '../../../shared/domain/entities/access-type';

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
