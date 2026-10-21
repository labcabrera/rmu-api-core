import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import type { AbsoluteManeuverResult } from '../../../domain/value-objects/absolute-maneuver-result.vo.js';

export type ManeuverTableDocument = ManeuverTableModel & Document;

export interface ManeuverTableEntryModel {
  min: number | null;
  max: number | null;
  result: AbsoluteManeuverResult;
}

/** Same shape as the code tables (AbsoluteManeuverTable), with the table name as _id. */
@Schema({ collection: 'maneuver-tables', id: true, versionKey: false })
export class ManeuverTableModel {
  @Prop({ type: String, required: true })
  _id: string;

  @Prop({ type: [Object], required: true })
  table: ManeuverTableEntryModel[];

  @Prop({ type: String, required: false })
  unusualEvent?: string;
}

export const ManeuverTableSchema = SchemaFactory.createForClass(ManeuverTableModel);
