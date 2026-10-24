import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import type { HydratedDocument } from 'mongoose';
import { RaceResistances, RaceStats, SexBasedAttribute } from './race-childs.model.js';
import { RaceTrait } from './race-trait.model.js';
// realm is now stored as realmId string
import type { AccessType } from '../../../../shared/domain/entities/access-type.js';
import { RaceSkillBonus } from './race-skill-bonus.model.js';

export type RaceDocument = HydratedDocument<RaceModel>;

@Schema({ collection: 'races', _id: false, versionKey: false })
export class RaceModel {
  /** Optimistic concurrency (spec 018): every update increments it. Missing in documents stored before. */
  @Prop({ type: Number, default: 0 })
  version: number;

  @Prop({ required: true })
  _id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  archetype: string;

  @Prop({ type: String, required: true })
  realmId: string;

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
// owner and accessType back the access filter of every listing (an $or that uses one index per branch).
RaceSchema.index({ owner: 1 });
RaceSchema.index({ accessType: 1 });
RaceSchema.index({ realmId: 1 });
RaceSchema.index({ name: 1 });
