import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import type { ManeuverTableRepository } from '../../application/ports/maneuver-table-repository.js';
import { AbsoluteManeuverTable } from '../../domain/value-objects/absolute-maneuver-table.vo.js';
import { type ManeuverTableDocument, ManeuverTableModel } from '../persistence/models/maneuver-table.model.js';

@Injectable()
export class MongoManeuverTableRepository implements ManeuverTableRepository {
  constructor(@InjectModel(ManeuverTableModel.name) private readonly model: Model<ManeuverTableDocument>) {}

  async findByName(name: string): Promise<AbsoluteManeuverTable | null> {
    const doc = await this.model.findById(name).lean<ManeuverTableModel>();
    return doc ? MongoManeuverTableRepository.mapToTable(doc) : null;
  }

  async findNames(): Promise<string[]> {
    const docs = await this.model.find({}, { _id: 1 }).sort({ _id: 1 }).lean<{ _id: string }[]>();
    return docs.map(doc => doc._id);
  }

  static mapToTable(doc: ManeuverTableModel): AbsoluteManeuverTable {
    return new AbsoluteManeuverTable(
      doc._id,
      (doc.table || []).map(entry => ({ min: entry.min ?? null, max: entry.max ?? null, result: entry.result })),
      doc.unusualEvent ?? '',
    );
  }
}
