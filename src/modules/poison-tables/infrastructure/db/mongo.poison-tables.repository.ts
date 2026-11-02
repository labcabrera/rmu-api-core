import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import type { PoisonTablesRepository } from '../../application/ports/poison-tables-repository.port.js';
import type { PoisonSeverityRow, PoisonTables, TimeRange, ValueRange } from '../../domain/value-objects/poison-tables.vo.js';
import { type PoisonTablesDocument, PoisonTablesModel } from '../persistence/models/poison-tables.model.js';

const time = (range?: TimeRange | null): TimeRange | null => (range ? { min: range.min, max: range.max, unit: range.unit } : null);
const value = (range?: ValueRange | null): ValueRange | null => (range ? { min: range.min, max: range.max } : null);

@Injectable()
export class MongoPoisonTablesRepository implements PoisonTablesRepository {
  constructor(@InjectModel(PoisonTablesModel.name) private readonly model: Model<PoisonTablesDocument>) {}

  async findById(id: string): Promise<PoisonTables | null> {
    const doc = await this.model.findById(id).lean<PoisonTablesModel>();
    return doc ? MongoPoisonTablesRepository.mapToTables(doc) : null;
  }

  static mapToTables(doc: PoisonTablesModel): PoisonTables {
    return {
      rows: (doc.rows || []).map((row): PoisonSeverityRow => ({
        category: row.category,
        severity: row.severity,
        start: time(row.start)!,
        duration: time(row.duration),
        penalty: value(row.penalty),
        hitsPerRound: value(row.hitsPerRound),
        hitsRounds: value(row.hitsRounds),
        condition: row.condition ?? null,
        conditionDelay: time(row.conditionDelay),
        conditionDuration: time(row.conditionDuration),
        permanent: !!row.permanent,
      })),
    };
  }
}
