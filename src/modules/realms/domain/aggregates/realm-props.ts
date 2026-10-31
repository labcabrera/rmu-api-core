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
  /** A realm of generic content (RMU Core, spec 055) usable from any campaign. Only an admin sets it. */
  generic: boolean;
  createdAt: Date;
  updatedAt?: Date;
}
