import { AccessType } from 'src/modules/shared/domain/entities/access-type';
import { SkillSpecialization } from '../value-objects/skill-specialization.vo';

export interface SkillProps {
  id: string;
  categoryId: string;
  bonus: string[];
  specialization: SkillSpecialization | null;
  owner: string;
  accessType: AccessType;
  createdAt: Date;
  updatedAt?: Date;
}
