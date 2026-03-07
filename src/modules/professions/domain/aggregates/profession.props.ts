import { ProfessionSkillCosts } from '../value-objects/profession-skill-cost.vo';

export interface ProfessionProps {
  id: string;
  skillCosts: ProfessionSkillCosts;
  professionalSkills: string[];
  description: string | undefined;
  imageUrl: string | undefined;
  owner: string;
  createdAt: Date;
  updatedAt?: Date;
}
