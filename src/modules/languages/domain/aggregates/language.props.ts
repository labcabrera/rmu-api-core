import { AccessType } from 'src/modules/shared/domain/entities/access-type';
import { NamedEntity } from 'src/modules/shared/domain/entities/named-entity';

export class LanguageProps {
  id: string;
  name: string;
  realm: NamedEntity;
  description?: string;
  owner: string;
  accessType: AccessType;
  createdAt: Date;
  updatedAt?: Date;
}
