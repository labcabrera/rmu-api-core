import { SkillSpecialization } from '../value-objects/skill-specialization.vo';

export interface Skill {
  id: string;
  categoryId: string;
  bonus: string[];
  specialization: SkillSpecialization | undefined;
}
