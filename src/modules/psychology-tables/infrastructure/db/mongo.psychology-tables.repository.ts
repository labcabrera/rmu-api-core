import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import type { PsychologyTablesRepository } from '../../application/ports/psychology-tables-repository.port.js';
import type { PsychologyTables } from '../../domain/value-objects/psychology-tables.vo.js';
import { type PsychologyTablesDocument, PsychologyTablesModel } from '../persistence/models/psychology-tables.model.js';

/** Open bounds may be stored as null or left out: both are returned as null. */
const band = (row: { min?: number | null; max?: number | null }) => ({ min: row.min ?? null, max: row.max ?? null });

@Injectable()
export class MongoPsychologyTablesRepository implements PsychologyTablesRepository {
  constructor(@InjectModel(PsychologyTablesModel.name) private readonly model: Model<PsychologyTablesDocument>) {}

  async findById(id: string): Promise<PsychologyTables | null> {
    const doc = await this.model.findById(id).lean<PsychologyTablesModel>();
    return doc ? MongoPsychologyTablesRepository.mapToTables(doc) : null;
  }

  static mapToTables(doc: PsychologyTablesModel): PsychologyTables {
    return {
      frightLevels: (doc.frightLevels || []).map(row => ({ key: row.key, level: row.level })),
      frightLevelModifiers: (doc.frightLevelModifiers || []).map(row => ({ key: row.key, level: row.level })),
      fearResults: (doc.fearResults || []).map(row => ({
        ...band(row),
        severity: row.severity,
        result: row.result,
        rallyModifier: row.rallyModifier,
      })),
      morale: (doc.morale || []).map(row => ({
        ...band(row),
        result: row.result,
        outcome: row.outcome,
        moraleModifier: row.moraleModifier ?? 0,
        moraleModifierDays: row.moraleModifierDays ?? null,
      })),
      moraleUnusualEvent: { ...doc.moraleUnusualEvent },
      rally: (doc.rally || []).map(row => ({ ...band(row), result: row.result, fearSeverityChange: row.fearSeverityChange })),
      rallyUnusualEvent: { ...doc.rallyUnusualEvent },
      rallyGroupModifier: { ...doc.rallyGroupModifier },
      resistance: (doc.resistance || []).map(row => ({ ...band(row), result: row.result, severity: row.severity })),
      resistanceRoll: { ...doc.resistanceRoll, stats: { ...doc.resistanceRoll.stats } },
    };
  }
}
