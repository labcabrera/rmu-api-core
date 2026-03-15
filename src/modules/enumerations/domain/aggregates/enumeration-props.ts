import { AccessType } from 'src/modules/shared/domain/entities/access-type';
import { EnumerationCategory } from '../value-objects/enumeration-category.vo';

export interface EnumerationProps {
  id: string;
  name: string;
  category: EnumerationCategory;
  owner: string;
  accessType: AccessType;
  createdAt: Date;
  updatedAt?: Date;
}
