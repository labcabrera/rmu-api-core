import { AccessType } from '../../../shared/domain/entities/access-type';
import { EnumerationCategory } from '../value-objects/enumeration-category.vo';
import { EntitySource } from '../../../shared/domain/entities/entity-source';

export interface EnumerationProps {
  id: string;
  key: string;
  category: EnumerationCategory;
  realmId: string | null;
  description: string | null;
  imageUrl: string | null;
  owner: string;
  accessType: AccessType;
  entitySource: EntitySource;
  createdAt: Date;
  updatedAt?: Date;
}
