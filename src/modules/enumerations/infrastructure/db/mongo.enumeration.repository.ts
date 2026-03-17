import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EnumerationRepository } from '../../application/ports/enumeration-repository';
import { Enumeration } from '../../domain/aggregates/enumeration';
import { EnumerationDocument, EnumerationModel } from '../persistence/models/enumeration.model';
import { RsqlParser } from 'src/modules/shared/infrastructure/persistence/repositories/rsql-parser';
import { MongoBaseRepository } from 'src/modules/shared/infrastructure/db/mongo.base.repository';

@Injectable()
export class MongoEnumerationRepository extends MongoBaseRepository<Enumeration, EnumerationDocument> implements EnumerationRepository {
  constructor(@InjectModel(EnumerationModel.name) model: Model<EnumerationDocument>, rsqlParser: RsqlParser) {
    super(model, rsqlParser);
  }

  findByKeyCategoryAndRealm(key: string, category: string, realmId: string | null): Promise<Enumeration | null> {
    const query = { key: key, category: category, realmId: realmId };
    return this.model
      .findOne(query)
      .exec()
      .then((doc) => (doc ? this.mapToEntity(doc) : null));
  }

  protected mapToEntity(doc: EnumerationDocument): Enumeration {
    return Enumeration.fromProps({
      id: doc.id as string,
      key: (doc as any).key,
      category: doc.category,
      realmId: (doc as any).realmId ?? null,
      owner: doc.owner,
      accessType: doc.accessType,
      entitySource: (doc as any).entitySource,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }
}
