import { AccessType } from 'src/modules/shared/domain/entities/access-type';
import { EnumerationCategory } from '../value-objects/enumeration-category.vo';
import { EntitySource } from 'src/modules/shared/domain/entities/entity-source';

export interface EnumerationProps {
  id: string;
  name: string;
  category: EnumerationCategory;
  realmId: string | null;
  owner: string;
  accessType: AccessType;
  entitySource: EntitySource;
  createdAt: Date;
  updatedAt?: Date;
}
