import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Race } from 'src/modules/races/domain/aggregates/race';
import { RaceDocument, RaceModel } from '../persistence/models/race-model';
import { RaceRepository } from '../../application/ports/race-repository';
import { Page } from 'src/modules/shared/domain/entities/page';
import { NotFoundError } from 'src/modules/shared/domain/errors/errors';
import { RsqlParser } from 'src/modules/shared/infrastructure/persistence/repositories/rsql-parser';

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

  async save(race: Race): Promise<Race> {
    const model = new this.raceModel({ ...race.toProps(), _id: race.id });
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
    return Race.fromProps({
      id: doc._id,
      name: doc.name,
      archetype: doc.archetype,
      realmId: doc.realmId,
      realmName: doc.realmName,
      sizeId: doc.sizeId,
      stats: doc.stats,
      resistances: doc.resistances,
      averageHeight: doc.averageHeight,
      averageWeight: doc.averageWeight,
      strideBonus: doc.strideBonus,
      enduranceBonus: doc.enduranceBonus,
      recoveryMultiplier: doc.recoveryMultiplier,
      baseHits: doc.baseHits,
      baseDevPoints: doc.baseDevPoints,
      baseAt: doc.baseAt,
      defaultLanguage: doc.defaultLanguage,
      talents: doc.talents,
      description: doc.description,
      owner: doc.owner,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }
}
