import { AccessType } from 'src/modules/shared/domain/entities/access-type';

export interface CultureProps {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  owner: string;
  accessType: AccessType;
  createdAt: Date;
  updatedAt: Date | null;
}
