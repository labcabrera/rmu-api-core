import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { RaceResistances, RaceStats, SexBasedAttribute } from './race-childs.model';

export type RaceDocument = RaceModel & Document;

@Schema({ collection: 'races', _id: false, versionKey: false })
export class RaceModel {
  @Prop({ required: true })
  _id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  realmId: string;

  @Prop({ required: true })
  realmName: string;

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

  @Prop({ type: String, required: false })
  defaultLanguage: string | undefined;

  @Prop({ type: [String], required: true })
  talents: string[] = [];

  @Prop({ type: String, required: false })
  description: string | undefined;

  @Prop({ required: true })
  owner: string;

  @Prop({ required: true })
  createdAt: Date;

  @Prop({ required: false })
  updatedAt?: Date;
}

export const RaceSchema = SchemaFactory.createForClass(RaceModel);
