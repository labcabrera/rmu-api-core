import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import type { AlchemyTablesRepository } from '../../application/ports/alchemy-tables-repository.port.js';
import {
  ALCHEMY_FAILURE_TABLES,
  ALCHEMY_TABLES_ID,
  type AlchemyFailureRow,
  type AlchemyFailureTable,
  type AlchemyTables,
  POWER_LEVELS,
  type PowerLevel,
} from '../../domain/value-objects/alchemy-tables.vo.js';
import { type AlchemyTablesDocument, AlchemyTablesModel } from '../persistence/models/alchemy-tables.model.js';

@Injectable()
export class MongoAlchemyTablesRepository implements AlchemyTablesRepository {
  constructor(@InjectModel(AlchemyTablesModel.name) private readonly model: Model<AlchemyTablesDocument>) {}

  async find(): Promise<AlchemyTables | null> {
    const doc = await this.model.findById(ALCHEMY_TABLES_ID).lean<AlchemyTablesModel>();
    return doc ? MongoAlchemyTablesRepository.mapToTables(doc) : null;
  }

  /** Every failure table, empty when missing, with its rows sorted by min and an open row's max as null. */
  static mapToTables(doc: AlchemyTablesModel): AlchemyTables {
    const failureTables = Object.fromEntries(
      ALCHEMY_FAILURE_TABLES.map(table => [table, MongoAlchemyTablesRepository.mapToRows(doc.failureTables?.[table])]),
    ) as Record<AlchemyFailureTable, AlchemyFailureRow[]>;
    const powerLevels = Object.fromEntries(POWER_LEVELS.map(level => [level, doc.powerLevels?.[level]])) as Record<PowerLevel, number>;
    return { id: ALCHEMY_TABLES_ID, failureTables, powerLevels, version: doc.version ?? 0 };
  }

  private static mapToRows(rows: AlchemyFailureRow[] | null | undefined): AlchemyFailureRow[] {
    return (rows || [])
      .map((row): AlchemyFailureRow => ({
        min: row.min,
        max: row.max ?? null,
        text: row.text,
        ...(row.serendipity ? { serendipity: row.serendipity } : {}),
      }))
      .sort((a, b) => a.min - b.min);
  }
}
