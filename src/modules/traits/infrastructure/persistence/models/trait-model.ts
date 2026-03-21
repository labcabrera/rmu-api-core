import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Trait } from 'src/modules/traits/domain/aggregates/trait';
import type { TraitSpecialization } from 'src/modules/traits/domain/value-objects/trait-specialization.vo';

export type TraitDocument = Trait & Document;

@Schema({ collection: 'traits', _id: false, versionKey: false })
export class TraitModel {
  @Prop({ required: true })
  _id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  category: string;

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
