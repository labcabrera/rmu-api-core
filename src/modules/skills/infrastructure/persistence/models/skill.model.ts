import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { EnumerationCategory } from 'src/modules/enumerations/domain/value-objects/enumeration-category.vo';
import type { AccessType } from 'src/modules/shared/domain/entities/access-type';

export type SkillDocument = SkillModel & Document;

@Schema({ collection: 'skills', id: true, versionKey: false })
export class SkillModel {
  @Prop({ type: String, required: true })
  _id: string;

  @Prop({ type: String, required: true })
  categoryId: string;

  @Prop({ type: [String], required: true })
  bonus: string[];

  @Prop({ type: String, required: false })
  specialization: EnumerationCategory | null;

  @Prop({ type: String, required: true })
  owner: string;

  @Prop({ type: String, required: true })
  accessType: AccessType;

  @Prop({ required: true })
  createdAt: Date;

  @Prop({ required: false })
  updatedAt?: Date;
}

export const SkillSchema = SchemaFactory.createForClass(SkillModel);
