import { injectable } from 'inversify';
import { Race, CreateRaceRequest, UpdateRaceRequest } from '@domain/entities/Race';
import { RaceRepository } from '@domain/ports/race-repository';
import { PaginationOptions, PaginatedResult } from '@shared/types';
import { RaceModel, RaceDocument } from '../models/RaceModel';

@injectable()
export class MongoRaceRepository implements RaceRepository {
  async findById(id: string): Promise<Race | null> {
    const raceDoc = await RaceModel.findById(id);
    return raceDoc ? this.mapToEntity(raceDoc) : null;
  }

  async findAll(options: PaginationOptions): Promise<PaginatedResult<Race>> {
    const skip = options.page * options.size;
    const [racesDocs, totalElements] = await Promise.all([
      RaceModel.find().skip(skip).limit(options.size).sort({ name: 1 }),
      RaceModel.countDocuments(),
    ]);

    const content = racesDocs.map(doc => this.mapToEntity(doc));

    return {
      content,
      pagination: {
        page: options.page,
        size: options.size,
        totalElements,
      },
    };
  }

  async save(request: CreateRaceRequest): Promise<Race> {
    const raceDoc = new RaceModel({
      _id: request.id,
      name: request.name,
      realm: request.realm,
      size: request.size,
      defaultStatBonus: request.defaultStatBonus,
      resistances: request.resistances,
      averageHeight: request.averageHeight,
      averageWeight: request.averageWeight,
      strideBonus: request.strideBonus,
      enduranceBonus: request.enduranceBonus,
      recoveryMultiplier: request.recoveryMultiplier,
      baseHits: request.baseHits,
      bonusDevPoints: request.bonusDevPoints,
      description: request.description,
    });

    const savedRace = await raceDoc.save();
    return this.mapToEntity(savedRace);
  }

  async update(id: string, request: UpdateRaceRequest): Promise<Race | null> {
    const updatedRace = await RaceModel.findByIdAndUpdate(id, { $set: request }, { new: true });
    return updatedRace ? this.mapToEntity(updatedRace) : null;
  }

  async deleteById(id: string): Promise<boolean> {
    const result = await RaceModel.findByIdAndDelete(id);
    return result !== null;
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
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }
}
