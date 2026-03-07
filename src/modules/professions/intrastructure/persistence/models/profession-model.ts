import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ProfessionSkillCosts } from './profession-skill-costs.model';

export type ProfessionDocument = ProfessionModel & Document;

@Schema({ collection: 'professions', id: true, versionKey: false })
export class ProfessionModel {
  @Prop({ required: true })
  _id: string;

  @Prop({ required: true })
  skillCosts: ProfessionSkillCosts;

  @Prop({ type: [String], required: true })
  professionalSkills: string[];

  @Prop({ type: String, required: false })
  description: string | undefined;

  @Prop({ type: String, required: false })
  imageUrl: string | undefined;

  @Prop({ required: true })
  owner: string;

  @Prop({ required: true })
  createdAt: Date;

  @Prop({ required: false })
  updatedAt?: Date;
}

export const ProfessionSchema = SchemaFactory.createForClass(ProfessionModel);
