import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import type { EnumerationCategory } from 'src/modules/enumerations/domain/value-objects/enumeration-category.vo';
import type { AccessType } from 'src/modules/shared/domain/entities/access-type';
import type { EntitySource } from 'src/modules/shared/domain/entities/entity-source';

export type EnumerationDocument = EnumerationModel & Document;

@Schema({ collection: 'enumerations', id: true, versionKey: false })
export class EnumerationModel {
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
