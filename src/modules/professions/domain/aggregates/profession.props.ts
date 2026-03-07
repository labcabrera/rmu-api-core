import { ProfessionSkillCosts } from '../value-objects/profession-skill-cost.vo';

export interface ProfessionProps {
  id: string;
  skillCosts: ProfessionSkillCosts;
  professionalSkills: string[];
  description: string | undefined;
  owner: string;
  createdAt: Date;
  updatedAt?: Date;
}
