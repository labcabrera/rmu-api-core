import { NamedEntity } from 'src/modules/shared/domain/entities/named-entity';

export class LanguageProps {
  id: string;
  name: string;
  realm: NamedEntity;
  description?: string;
  owner: string;
  createdAt: Date;
  updatedAt?: Date;
}
