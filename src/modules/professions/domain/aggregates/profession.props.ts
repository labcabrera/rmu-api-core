import { ProfessionSkillCosts } from '../value-objects/profession-skill-cost.vo';
import { RealmType } from '../value-objects/realm-type.vo';

export interface ProfessionProps {
  id: string;
  availableRealmTypes: RealmType[];
  fixedRealmTypes: RealmType[];
  skillCosts: ProfessionSkillCosts;
  professionalSkills: string[];
  description: string | undefined;
  imageUrl: string | undefined;
  owner: string;
  createdAt: Date;
  updatedAt?: Date;
}
