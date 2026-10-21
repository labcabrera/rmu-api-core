import type { AccessType } from '../../../shared/domain/entities/access-type.js';
import type { EnumerationCategory } from '../value-objects/enumeration-category.vo.js';
import type { EntitySource } from '../../../shared/domain/entities/entity-source.js';

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
