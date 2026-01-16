import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SkillCategoryDocument = SkillCategoryModel & Document;

@Schema({ collection: 'skillCategories', id: false, versionKey: false })
export class SkillCategoryModel {
  @Prop({ type: String, required: true })
  id: string;

  @Prop({ type: [String], required: true })
  bonus: string[];
}

export const SkillCategorySchema = SchemaFactory.createForClass(SkillCategoryModel);
