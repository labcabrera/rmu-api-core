import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Race } from '../../domain/aggregates/race.js';
import { type RaceDocument, RaceModel } from '../persistence/models/race-model.js';
import type { RaceRepository } from '../../application/ports/race-repository.js';
import { RsqlParser } from '../../../shared/infrastructure/persistence/repositories/rsql-parser.js';
import { MongoBaseRepository } from '../../../shared/infrastructure/db/mongo.base.repository.js';
import type { AccessType } from '../../../shared/domain/entities/access-type.js';

@Injectable()
export class MongoRaceRepository extends MongoBaseRepository<Race, RaceDocument> implements RaceRepository {
  constructor(@InjectModel(RaceModel.name) raceModel: Model<RaceDocument>, rsqlParser: RsqlParser) {
    super(raceModel, rsqlParser);
  }

  async updateRealmInfo(realmId: string, realmName: string, realmOwner: string, accessType: AccessType): Promise<void> {
    const now = new Date();
    const update = { owner: realmOwner, accessType: accessType, updatedAt: now };
    await this.model.updateMany({ realmId: realmId }, { $set: update }).exec();
  }

  async findByRealmId(realmId: string): Promise<Race[]> {
    const values = await this.model.find({ realmId: realmId }).exec();
    return values.map(doc => this.mapToEntity(doc));
  }

  protected mapToEntity(doc: RaceDocument): Race {
    return Race.fromProps({
      id: doc._id,
      name: doc.name,
      archetype: doc.archetype,
      realmId: doc.realmId,
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
      traits: doc.traits ?? [],
      skillBonuses: doc.skillBonuses ?? [],
      description: doc.description,
      imageUrl: doc.imageUrl,
      owner: doc.owner,
      accessType: doc.accessType,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }
}
