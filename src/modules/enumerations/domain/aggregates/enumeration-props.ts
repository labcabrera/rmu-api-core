import type { AccessType } from '../../../shared/domain/entities/access-type.js';
import type { EnumerationCategory } from '../value-objects/enumeration-category.vo.js';
import type { EntitySource } from '../../../shared/domain/entities/entity-source.js';

export interface EnumerationProps {
  id: string;
  /** Normalized key (spec 050): what references store. Derived from the name and never changed. */
  key: string;
  /** The name as the user wrote it, shown when the key has no translation. */
  name: string;
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
