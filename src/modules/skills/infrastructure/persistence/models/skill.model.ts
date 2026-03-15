import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

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
  specialization: string;
}

export const SkillSchema = SchemaFactory.createForClass(SkillModel);
