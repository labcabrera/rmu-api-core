import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import type { AccessType } from 'src/modules/shared/domain/entities/access-type';
import { SkillSpecialization } from 'src/modules/skills/domain/value-objects/skill-specialization.vo';

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
  specialization: SkillSpecialization | null;

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
