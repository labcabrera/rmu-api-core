import { EnumerationCategory } from 'src/modules/enumerations/domain/value-objects/enumeration-category.vo';
import { AccessType } from 'src/modules/shared/domain/entities/access-type';

export interface SkillProps {
  id: string;
  categoryId: string;
  bonus: string[];
  specialization: EnumerationCategory | null;
  owner: string;
  accessType: AccessType;
  createdAt: Date;
  updatedAt?: Date;
}
