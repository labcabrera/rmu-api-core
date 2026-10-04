import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import type { EffectPropertyRequirement } from 'src/modules/effect-types/domain/value-objects/effect-property-requirement.vo';
import type { AccessType } from 'src/modules/shared/domain/entities/access-type';
import type { EntitySource } from 'src/modules/shared/domain/entities/entity-source';

export type EffectTypeDocument = EffectTypeModel & Document;

@Schema({ collection: 'effect-types', id: true, versionKey: false })
export class EffectTypeModel {
  @Prop({ type: String, required: true })
  _id: string;

  @Prop({ type: Boolean, required: true })
  isPersistent: boolean;

  @Prop({ type: Boolean, required: true })
  isStackable: boolean;

  @Prop({ type: String, required: true })
  value: EffectPropertyRequirement;

  @Prop({ type: String, required: true })
  modifier: EffectPropertyRequirement;

  @Prop({ type: String, required: true })
  rounds: EffectPropertyRequirement;

  @Prop({ type: String, required: true })
  text: EffectPropertyRequirement;

  @Prop({ type: String, required: true })
  location: EffectPropertyRequirement;

  @Prop({ type: String, required: true })
  delay: EffectPropertyRequirement;

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

export const EffectTypeSchema = SchemaFactory.createForClass(EffectTypeModel);
