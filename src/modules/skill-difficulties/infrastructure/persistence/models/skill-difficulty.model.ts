import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import type { HydratedDocument } from 'mongoose';
import type { DifficultyExample, LocalizedText } from '../../../domain/value-objects/skill-difficulty-guide.vo.js';

export type SkillDifficultyDocument = HydratedDocument<SkillDifficultyModel>;

/** One document per skill, with the skill id as _id. Imported with data/scripts/import-skill-difficulties.js. */
@Schema({ collection: 'skill-difficulties', id: true, versionKey: false })
export class SkillDifficultyModel {
  @Prop({ type: String, required: true })
  _id: string;

  @Prop({ type: Object, required: false })
  context?: LocalizedText;

  @Prop({ type: String, required: false })
  sharedWith?: string;

  @Prop({ type: [Object], required: true })
  examples: DifficultyExample[];
}

export const SkillDifficultySchema = SchemaFactory.createForClass(SkillDifficultyModel);
