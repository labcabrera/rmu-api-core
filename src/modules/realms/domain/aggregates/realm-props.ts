import { AccessType } from 'src/modules/shared/domain/entities/access-type';
import { MagicPresence } from '../value-objects/realm-magic-type.vo';

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
