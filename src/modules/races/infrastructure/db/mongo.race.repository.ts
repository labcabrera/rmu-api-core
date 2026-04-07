import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Race } from 'src/modules/races/domain/aggregates/race';
import { RaceDocument, RaceModel } from '../persistence/models/race-model';
import { RaceRepository } from '../../application/ports/race-repository';
import { RsqlParser } from 'src/modules/shared/infrastructure/persistence/repositories/rsql-parser';
import { NamedEntity } from 'src/modules/shared/domain/entities/named-entity';
import { MongoBaseRepository } from 'src/modules/shared/infrastructure/db/mongo.base.repository';
import { AccessType } from 'src/modules/shared/domain/entities/access-type';

@Injectable()
export class MongoRaceRepository extends MongoBaseRepository<Race, RaceDocument> implements RaceRepository {
  constructor(@InjectModel(RaceModel.name) raceModel: Model<RaceDocument>, rsqlParser: RsqlParser) {
    super(raceModel, rsqlParser);
  }

  async updateRealmInfo(realmId: string, realmName: string, realmOwner: string, accessType: AccessType): Promise<void> {
    const now = new Date();
    const update = { 'realm.name': realmName, owner: realmOwner, accessType: accessType, updatedAt: now };
    await this.model.updateMany({ 'realm.id': realmId }, { $set: update }).exec();
  }

  async findByRealmId(realmId: string): Promise<Race[]> {
    const values = await this.model.find({ 'realm.id': realmId }).exec();
    return values.map((doc) => this.mapToEntity(doc));
  }

  protected mapToEntity(doc: RaceDocument): Race {
    return Race.fromProps({
      id: doc._id,
      name: doc.name,
      archetype: doc.archetype,
      realm: new NamedEntity(doc.realm.id, doc.realm.name),
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
