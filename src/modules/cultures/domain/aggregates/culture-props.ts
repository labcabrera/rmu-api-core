import { AccessType } from 'src/modules/shared/domain/entities/access-type';
import { CultureSkillRank } from '../value-objects/culture-skill-rank';

export interface CultureProps {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  owner: string;
  accessType: AccessType;
  skillRanks: CultureSkillRank[];
  languages?: string[];
  suggestedCrafts?: string;
  suggestedVocations?: string;
  createdAt: Date;
  updatedAt: Date | null;
}

export type CreateCultureProps = Omit<CultureProps, 'id' | 'createdAt' | 'updatedAt'>;

export type UpdateCultureProps = Partial<Omit<CultureProps, 'id' | 'createdAt' | 'updatedAt' | 'owner'>>;
