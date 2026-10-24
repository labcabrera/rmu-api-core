import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import type { TraitCategory } from '../../../domain/value-objects/trait-category.vo.js';
import type { TraitSpecialization } from '../../../domain/value-objects/trait-specialization.vo.js';

export type TraitDocument = TraitModel & Document;

@Schema({ collection: 'traits', _id: false, versionKey: false })
export class TraitModel {
  /** Optimistic concurrency (spec 018): every update increments it. Missing in documents stored before. */
  @Prop({ type: Number, default: 0 })
  version: number;

  @Prop({ required: true })
  _id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ type: String, required: true })
  category: TraitCategory;

  @Prop({ required: true })
  isTalent: boolean;

  @Prop({ type: String, required: false })
  specialization: TraitSpecialization | null;

  @Prop({ required: true })
  isTierBased: boolean;

  @Prop({ type: Number, required: false })
  maxTier: number | undefined;

  @Prop({ type: Number, required: true })
  adquisitionCost: number;

  @Prop({ type: Number, required: false })
  tierCost: number | undefined;

  @Prop({ required: false })
  description?: string;

  @Prop({ required: true })
  owner: string;

  @Prop({ required: true })
  createdAt: Date;

  @Prop({ required: false })
  updatedAt?: Date;
}

export const TraitSchema = SchemaFactory.createForClass(TraitModel);
// owner and accessType back the access filter of every listing (an $or that uses one index per branch).
TraitSchema.index({ owner: 1 });
