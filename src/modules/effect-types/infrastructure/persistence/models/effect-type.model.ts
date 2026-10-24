import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import type { HydratedDocument } from 'mongoose';
import type { EffectPropertyRequirement } from '../../../domain/value-objects/effect-property-requirement.vo.js';
import type { AccessType } from '../../../../shared/domain/entities/access-type.js';
import type { EntitySource } from '../../../../shared/domain/entities/entity-source.js';

export type EffectTypeDocument = HydratedDocument<EffectTypeModel>;

@Schema({ collection: 'effect-types', id: true, versionKey: false })
export class EffectTypeModel {
  /** Optimistic concurrency (spec 018): every update increments it. Missing in documents stored before. */
  @Prop({ type: Number, default: 0 })
  version: number;

  @Prop({ type: String, required: true })
  _id: string;

  @Prop({ type: Boolean, required: true })
  isPersistent: boolean;

  @Prop({ type: Boolean, required: true })
  isStackable: boolean;

  @Prop({ type: String, required: true })
  value: EffectPropertyRequirement;

  @Prop({ type: String, required: true })
  modifier: EffectPropertyRequirement;

  @Prop({ type: String, required: true })
  rounds: EffectPropertyRequirement;

  @Prop({ type: String, required: true })
  text: EffectPropertyRequirement;

  @Prop({ type: String, required: true })
  location: EffectPropertyRequirement;

  @Prop({ type: String, required: true })
  delay: EffectPropertyRequirement;

  @Prop({ type: String, required: true })
  owner: string;

  @Prop({ type: String, required: true })
  accessType: AccessType;

  @Prop({ type: String, required: true })
  entitySource: EntitySource;

  @Prop({ type: Date, required: true })
  createdAt: Date;

  @Prop({ type: Date, required: false })
  updatedAt?: Date;
}

export const EffectTypeSchema = SchemaFactory.createForClass(EffectTypeModel);
// owner and accessType back the access filter of every listing (an $or that uses one index per branch).
EffectTypeSchema.index({ owner: 1 });
EffectTypeSchema.index({ accessType: 1 });
