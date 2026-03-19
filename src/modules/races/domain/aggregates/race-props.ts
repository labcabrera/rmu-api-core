import { NamedEntity } from 'src/modules/shared/domain/entities/named-entity';
import { RaceResistances } from '../value-objects/race-resistances.vo';
import { RaceStats } from '../value-objects/race-stats.vo';
import { RaceTrait } from '../value-objects/race-trait.vo';
import { SexBasedAttribute } from '../value-objects/sex-based-attribute.vo';
import { AccessType } from 'src/modules/shared/domain/entities/access-type';

export interface RaceProps {
  id: string;
  archetype: string;
  name: string;
  realm: NamedEntity;
  sizeId: string;
  stats: RaceStats;
  resistances: RaceResistances;
  averageHeight: SexBasedAttribute;
  averageWeight: SexBasedAttribute;
  strideBonus: number;
  enduranceBonus: number;
  recoveryMultiplier: number;
  baseHits: number;
  baseDevPoints: number;
  baseAt: number;
  defaultLanguage: string | null;
  talents: string[];
  traits: RaceTrait[];
  description: string | null;
  imageUrl: string | null;
  owner: string;
  accessType: AccessType;
  createdAt: Date;
  updatedAt: Date | null;
}
