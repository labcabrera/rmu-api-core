import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ProfessionSkillCosts } from './profession-skill-costs.model';
import { RealmType } from 'src/modules/professions/domain/value-objects/realm-type.vo';
import type { ProfessionArchetype } from 'src/modules/professions/domain/value-objects/profession-archetype.vo';
import type { EntitySource } from 'src/modules/shared/domain/entities/entity-source';

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

  @Prop({ required: true })
  owner: string;

  @Prop({ required: true })
  createdAt: Date;

  @Prop({ required: false })
  updatedAt?: Date;
}

export const ProfessionSchema = SchemaFactory.createForClass(ProfessionModel);
