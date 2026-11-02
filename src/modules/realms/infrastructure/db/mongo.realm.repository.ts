import { Injectable } from '@nestjs/common';
import type { RealmRepository } from '../../application/ports/realm-repository.port.js';
import { Realm } from '../../domain/aggregates/realm.js';
import { RealmModel, type RealmDocument } from '../persistence/models/realm.model.js';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { RsqlParser } from '../../../shared/infrastructure/db/rsql-parser.js';
import { MongoBaseRepository } from '../../../shared/infrastructure/db/mongo.base.repository.js';
import type { QueryCriteria } from '../../../shared/application/criteria/query-criteria.js';
import { MongoQueryCriteriaMapper } from '../../../shared/infrastructure/db/mongo-query-criteria.mapper.js';

@Injectable()
export class MongoRealmRepository extends MongoBaseRepository<Realm, RealmDocument> implements RealmRepository {
  constructor(@InjectModel(RealmModel.name) realmModel: Model<RealmDocument>, rsqlParser: RsqlParser) {
    super(realmModel, rsqlParser);
  }

  async findByIds(ids: string[]): Promise<Realm[]> {
    if (ids.length === 0) return [];
    const docs = await this.model.find({ _id: { $in: ids } });
    return docs.map(doc => this.toEntity(doc));
  }

  async findIdsMatching(filter: QueryCriteria): Promise<string[]> {
    const docs = await this.model.find(MongoQueryCriteriaMapper.toFilterQuery(filter), { _id: 1 }).lean();
    return docs.map(doc => doc._id);
  }

  async findOwnedSharedWith(ownerId: string, userId: string): Promise<Realm[]> {
    const docs = await this.model.find({ owner: ownerId, 'shares.userId': userId });
    return docs.map(doc => this.toEntity(doc));
  }

  protected mapToEntity(doc: RealmDocument): Realm {
    return Realm.fromProps({
      id: doc._id,
      name: doc.name,
      magicPresence: doc.magicPresence,
      shortDescription: doc.shortDescription,
      description: doc.description,
      imageUrl: doc.imageUrl,
      owner: doc.owner,
      entitySource: doc.entitySource ?? 'user',
      accessType: doc.accessType,
      generic: doc.generic ?? false,
      shares: (doc.shares ?? []).map(s => ({ userId: s.userId, userName: s.userName, level: s.level, grantedAt: s.grantedAt })),
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }
}
