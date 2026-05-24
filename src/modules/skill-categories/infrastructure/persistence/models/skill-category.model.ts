import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SkillCategoryDocument = SkillCategoryModel & Document;

@Schema({ collection: 'skill-categories', id: true, versionKey: false })
export class SkillCategoryModel {
  @Prop({ type: String, required: true })
  _id: string;

  @Prop({ type: [String], required: true })
  bonus: string[];

  @Prop({ type: Number, required: false })
  realmBonus: number | null;
}

export const SkillCategorySchema = SchemaFactory.createForClass(SkillCategoryModel);
