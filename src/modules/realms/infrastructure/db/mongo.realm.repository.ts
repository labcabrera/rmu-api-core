import { Injectable } from '@nestjs/common';
import type { RealmRepository } from '../../application/ports/realm-repository.js';
import { Realm } from '../../domain/aggregates/realm.js';
import { RealmModel, type RealmDocument } from '../persistence/models/realm-model.js';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { RsqlParser } from '../../../shared/infrastructure/persistence/repositories/rsql-parser.js';
import { MongoBaseRepository } from '../../../shared/infrastructure/db/mongo.base.repository.js';

@Injectable()
export class MongoRealmRepository extends MongoBaseRepository<Realm, RealmDocument> implements RealmRepository {
  constructor(@InjectModel(RealmModel.name) realmModel: Model<RealmDocument>, rsqlParser: RsqlParser) {
    super(realmModel, rsqlParser);
  }

  protected mapToEntity(doc: RealmDocument): Realm {
    return Realm.fromProps({
      id: doc.id as string,
      name: doc.name,
      magicPresence: doc.magicPresence,
      shortDescription: doc.shortDescription,
      description: doc.description,
      imageUrl: doc.imageUrl,
      owner: doc.owner,
      accessType: doc.accessType,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }
}
