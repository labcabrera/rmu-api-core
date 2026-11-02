import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import type { HydratedDocument } from 'mongoose';
import type { PoisonSeverityRow } from '../../../domain/value-objects/poison-tables.vo.js';

export type PoisonTablesDocument = HydratedDocument<PoisonTablesModel>;

/** Same shape as PoisonTables, with the rulebook as _id. Imported with data/scripts/import-poison-tables-042.js. */
@Schema({ collection: 'poison-tables', id: true, versionKey: false })
export class PoisonTablesModel {
  @Prop({ type: String, required: true })
  _id: string;

  @Prop({ type: [Object], required: true })
  rows: PoisonSeverityRow[];
}

export const PoisonTablesSchema = SchemaFactory.createForClass(PoisonTablesModel);
