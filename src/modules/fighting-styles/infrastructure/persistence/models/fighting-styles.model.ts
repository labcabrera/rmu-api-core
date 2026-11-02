import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import type { HydratedDocument } from 'mongoose';
import type { FightingStyle, StyleAbility } from '../../../domain/value-objects/fighting-styles.vo.js';

export type FightingStylesDocument = HydratedDocument<FightingStylesModel>;

/** Same shape as FightingStyleCatalog, with the rulebook as _id. Imported with data/scripts/import-fighting-styles.js. */
@Schema({ collection: 'fighting-styles', id: true, versionKey: false })
export class FightingStylesModel {
  @Prop({ type: String, required: true })
  _id: string;

  @Prop({ type: [Object], required: true })
  styles: FightingStyle[];

  @Prop({ type: [Object], required: true })
  abilities: StyleAbility[];
}

export const FightingStylesSchema = SchemaFactory.createForClass(FightingStylesModel);
