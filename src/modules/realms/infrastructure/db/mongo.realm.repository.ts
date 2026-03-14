import { Injectable } from '@nestjs/common';
import { RealmRepository } from 'src/modules/realms/application/ports/realm-repository';
import { Realm } from 'src/modules/realms/domain/aggregates/realm';
import { RealmModel, RealmDocument } from '../persistence/models/realm-model';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose/dist/common/mongoose.decorators';
import { RsqlParser } from 'src/modules/shared/infrastructure/persistence/repositories/rsql-parser';
import { MongoBaseRepository } from 'src/modules/shared/infrastructure/db/mongo.base.repository';

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
