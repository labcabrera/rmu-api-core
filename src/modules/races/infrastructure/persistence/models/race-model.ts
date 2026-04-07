import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { RaceResistances, RaceStats, SexBasedAttribute } from './race-childs.model';
import { RaceTrait } from './race-trait.model';
import { NamedEntity } from 'src/modules/shared/infrastructure/persistence/models/named-entity.model';
import type { AccessType } from 'src/modules/shared/domain/entities/access-type';
import { RaceSkillBonus } from './race-skill-bonus.model';

export type RaceDocument = RaceModel & Document;

@Schema({ collection: 'races', _id: false, versionKey: false })
export class RaceModel {
  @Prop({ required: true })
  _id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  archetype: string;

  @Prop({ type: NamedEntity, required: true })
  realm: NamedEntity;

  @Prop({ required: true })
  sizeId: string;

  @Prop({ type: RaceStats, required: true })
  stats: RaceStats;

  @Prop({ type: RaceResistances, required: true })
  resistances: RaceResistances;

  @Prop({ type: SexBasedAttribute, required: true })
  averageHeight: SexBasedAttribute;

  @Prop({ type: SexBasedAttribute, required: true })
  averageWeight: SexBasedAttribute;

  @Prop({ required: true })
  strideBonus: number;

  @Prop({ required: true })
  enduranceBonus: number;

  @Prop({ required: true })
  recoveryMultiplier: number;

  @Prop({ required: true })
  baseHits: number;

  @Prop({ required: true })
  baseDevPoints: number;

  @Prop({ required: true })
  baseAt: number;

  @Prop({ type: [String], required: true })
  talents: string[] = [];

  @Prop({ type: [RaceTrait], required: true })
  traits: RaceTrait[] = [];

  @Prop({ type: [RaceSkillBonus], required: true })
  skillBonuses: RaceSkillBonus[];

  @Prop({ type: String, required: false })
  defaultLanguage: string | null;

  @Prop({ type: String, required: false })
  description: string | null;

  @Prop({ type: String, required: false })
  imageUrl: string | null;

  @Prop({ type: String, required: true })
  owner: string;

  @Prop({ type: String, required: true })
  accessType: AccessType;

  @Prop({ type: Date, required: true })
  createdAt: Date;

  @Prop({ type: Date, required: false })
  updatedAt: Date | null;
}

export const RaceSchema = SchemaFactory.createForClass(RaceModel);
