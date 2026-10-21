import type { AccessType } from '../../../shared/domain/entities/access-type.js';
import type { MagicPresence } from '../value-objects/realm-magic-type.vo.js';

export interface RealmProps {
  id: string;
  name: string;
  magicPresence: MagicPresence;
  shortDescription?: string;
  description?: string;
  imageUrl?: string;
  owner: string;
  accessType: AccessType;
  createdAt: Date;
  updatedAt?: Date;
}
