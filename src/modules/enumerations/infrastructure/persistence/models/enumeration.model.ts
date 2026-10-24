import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import type { HydratedDocument } from 'mongoose';
import type { EnumerationCategory } from '../../../domain/value-objects/enumeration-category.vo.js';
import type { AccessType } from '../../../../shared/domain/entities/access-type.js';
import type { EntitySource } from '../../../../shared/domain/entities/entity-source.js';

export type EnumerationDocument = HydratedDocument<EnumerationModel>;

@Schema({ collection: 'enumerations', id: true, versionKey: false })
export class EnumerationModel {
  /** Optimistic concurrency (spec 018): every update increments it. Missing in documents stored before. */
  @Prop({ type: Number, default: 0 })
  version: number;

  @Prop({ type: String, required: true })
  _id: string;

  @Prop({ type: String, required: true })
  key: string;

  @Prop({ type: String, required: true })
  category: EnumerationCategory;

  @Prop({ type: String, required: false, default: null })
  realmId: string | null;

  @Prop({ type: String, required: false, default: null })
  description: string | null;

  @Prop({ type: String, required: false, default: null })
  imageUrl: string | null;

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

export const EnumerationSchema = SchemaFactory.createForClass(EnumerationModel);
// owner and accessType back the access filter of every listing (an $or that uses one index per branch).
EnumerationSchema.index({ owner: 1 });
EnumerationSchema.index({ accessType: 1 });
EnumerationSchema.index({ key: 1, category: 1 });
EnumerationSchema.index({ realmId: 1 });
