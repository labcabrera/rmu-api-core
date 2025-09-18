import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RaceRepository } from 'src/modules/races/application/ports/out/race-repository';
import { Page } from 'src/modules/core/domain/entities/page';
import { Race } from 'src/modules/races/domain/aggregates/race';
import { RsqlParser } from '../../../core/infrastructure/persistence/repositories/rsql-parser';
import { NotFoundError } from 'src/modules/core/domain/errors/errors';
import { RaceDocument, RaceModel } from '../persistence/models/race-model';

@Injectable()
export class MongoRaceRepository implements RaceRepository {
  constructor(
    @InjectModel(RaceModel.name) private raceModel: Model<RaceDocument>,
    private rsqlParser: RsqlParser,
  ) {}

  async findById(id: string): Promise<Race | null> {
    const readed = await this.raceModel.findById(id);
    return readed ? this.mapToEntity(readed) : null;
  }

  async findByRsql(rsql: string, page: number, size: number): Promise<Page<Race>> {
    const skip = page * size;
    const mongoQuery = this.rsqlParser.parse(rsql);
    const [racesDocs, totalElements] = await Promise.all([
      this.raceModel.find(mongoQuery).skip(skip).limit(size).sort({ name: 1 }),
      this.raceModel.countDocuments(mongoQuery),
    ]);
    const content = racesDocs.map((doc) => this.mapToEntity(doc));
    return new Page<Race>(content, page, size, totalElements);
  }

  async save(race: Partial<Race>): Promise<Race> {
    const model = new this.raceModel({ ...race, _id: race.id });
    await model.save();
    return this.mapToEntity(model);
  }

  async update(id: string, request: Partial<Race>): Promise<Race> {
    const updatedRace = await this.raceModel.findByIdAndUpdate(id, { $set: request }, { new: true });
    if (!updatedRace) {
      throw new NotFoundError('Race', id);
    }
    return this.mapToEntity(updatedRace);
  }

  async deleteById(id: string): Promise<Race | null> {
    const result = await this.raceModel.findByIdAndDelete(id);
    return result ? this.mapToEntity(result) : null;
  }

  async existsById(id: string): Promise<boolean> {
    const exists = await this.raceModel.exists({ _id: id });
    return exists !== null;
  }

  private mapToEntity(doc: RaceDocument): Race {
    return new Race(
      doc._id,
      doc.name,
      doc.realmId,
      doc.realmName,
      doc.size,
      doc.stats,
      doc.resistances,
      doc.averageHeight,
      doc.averageWeight,
      doc.strideBonus,
      doc.enduranceBonus,
      doc.recoveryMultiplier,
      doc.baseHits,
      doc.baseDevPoints,
      doc.baseAt,
      doc.defaultLanguage,
      doc.talents,
      doc.description,
      doc.owner,
      doc.createdAt,
      doc.updatedAt,
    );
  }
}
