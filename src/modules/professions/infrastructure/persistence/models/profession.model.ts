import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ProfessionSkillCosts } from './profession-skill-costs.model.js';
import type { RealmType } from '../../../domain/value-objects/realm-type.vo.js';
import type { ProfessionArchetype } from '../../../domain/value-objects/profession-archetype.vo.js';
import type { EntitySource } from '../../../../shared/domain/entities/entity-source.js';
import type { AccessType } from '../../../../shared/domain/entities/access-type.js';

export type ProfessionDocument = ProfessionModel & Document;

@Schema({ collection: 'professions', id: true, versionKey: false })
export class ProfessionModel {
  @Prop({ required: true })
  _id: string;

  @Prop({ type: [String], required: true })
  availableRealmTypes: RealmType[];

  @Prop({ type: [String], required: true })
  fixedRealmTypes: RealmType[];

  @Prop({ type: String, required: true })
  archetype: ProfessionArchetype;

  @Prop({ required: true })
  skillCosts: ProfessionSkillCosts;

  @Prop({ type: [String], required: true })
  professionalSkills: string[];

  @Prop({ type: String, required: true })
  entitySource: EntitySource;

  @Prop({ type: String, required: false })
  description: string | undefined;

  @Prop({ type: String, required: false })
  imageUrl: string | undefined;

  @Prop({ type: String, required: true })
  owner: string;

  @Prop({ type: String, required: true })
  accessType: AccessType;

  @Prop({ required: true })
  createdAt: Date;

  @Prop({ required: false })
  updatedAt?: Date;
}

export const ProfessionSchema = SchemaFactory.createForClass(ProfessionModel);
// owner and accessType back the access filter of every listing (an $or that uses one index per branch).
ProfessionSchema.index({ owner: 1 });
ProfessionSchema.index({ accessType: 1 });
