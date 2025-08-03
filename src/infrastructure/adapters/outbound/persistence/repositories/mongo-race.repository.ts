import { injectable } from 'inversify';
import { Race, UpdateRaceRequest } from '@domain/entities/race';
import { RaceRepository } from '@domain/ports/race-repository';
import { RaceModel, RaceDocument } from '../models/race-model';
import { Page } from '@domain/entities/page';
import { RaceQuery } from '@domain/queries/race-query';
import { NotFoundError } from '@domain/errors/errors';

@injectable()
export class MongoRaceRepository implements RaceRepository {
  async findById(id: string): Promise<Race | null> {
    const readed = await RaceModel.findById(id);
    return readed ? this.mapToEntity(readed) : null;
  }

  async find(query: RaceQuery): Promise<Page<Race>> {
    const skip = query.page * query.size;
    const mongoQuery = {};
    //TODO
    const [racesDocs, totalElements] = await Promise.all([
      RaceModel.find(mongoQuery).skip(skip).limit(query.size).sort({ name: 1 }),
      RaceModel.countDocuments(mongoQuery),
    ]);
    const content = racesDocs.map(doc => this.mapToEntity(doc));
    return {
      content,
      pagination: {
        page: query.page,
        size: query.size,
        totalElements,
        totalPages: Math.ceil(totalElements / query.size),
      },
    };
  }
  async save(race: Partial<Race>): Promise<Race> {
    const data = { ...race, _id: race.id };
    const raceModel = new RaceModel(data);
    const saved = await raceModel.save();
    return this.mapToEntity(saved);
  }

  async update(id: string, request: UpdateRaceRequest): Promise<Race> {
    const updatedRace = await RaceModel.findByIdAndUpdate(id, { $set: request }, { new: true });
    if (!updatedRace) {
      throw new NotFoundError('Race', id);
    }
    return this.mapToEntity(updatedRace);
  }

  async deleteById(id: string): Promise<void> {
    const deleted = await RaceModel.findByIdAndDelete(id);
    if (!deleted) {
      throw new NotFoundError('Race', id);
    }
  }

  async existsById(id: string): Promise<boolean> {
    const exists = await RaceModel.exists({ _id: id });
    return exists !== null;
  }

  private mapToEntity(doc: RaceDocument): Race {
    return {
      id: doc._id,
      name: doc.name,
      realm: doc.realm,
      size: doc.size,
      defaultStatBonus: doc.defaultStatBonus,
      resistances: doc.resistances,
      averageHeight: doc.averageHeight,
      averageWeight: doc.averageWeight,
      strideBonus: doc.strideBonus,
      enduranceBonus: doc.enduranceBonus,
      recoveryMultiplier: doc.recoveryMultiplier,
      baseHits: doc.baseHits,
      bonusDevPoints: doc.bonusDevPoints,
      description: doc.description,
      owner: doc.owner,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }
}
