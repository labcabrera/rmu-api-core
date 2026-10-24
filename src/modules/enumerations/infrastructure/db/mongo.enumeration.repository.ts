import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import type { EnumerationRepository } from '../../application/ports/enumeration-repository.port.js';
import { Enumeration } from '../../domain/aggregates/enumeration.js';
import { type EnumerationDocument, EnumerationModel } from '../persistence/models/enumeration.model.js';
import { RsqlParser } from '../../../shared/infrastructure/db/rsql-parser.js';
import type { EnumerationCategory } from '../../domain/value-objects/enumeration-category.vo.js';
import { MongoBaseRepository } from '../../../shared/infrastructure/db/mongo.base.repository.js';

@Injectable()
export class MongoEnumerationRepository extends MongoBaseRepository<Enumeration, EnumerationDocument> implements EnumerationRepository {
  constructor(@InjectModel(EnumerationModel.name) model: Model<EnumerationDocument>, rsqlParser: RsqlParser) {
    super(model, rsqlParser);
  }

  findByKeyCategoryAndRealm(key: string, category: string, realmId: string | null): Promise<Enumeration | null> {
    const query = { key: key, category: category as EnumerationCategory, realmId: realmId };
    return this.model
      .findOne(query)
      .exec()
      .then(doc => (doc ? this.toEntity(doc) : null));
  }

  protected mapToEntity(doc: EnumerationDocument): Enumeration {
    return Enumeration.fromProps({
      id: doc._id,
      key: doc.key,
      category: doc.category,
      realmId: doc.realmId ?? null,
      description: doc.description ?? null,
      imageUrl: doc.imageUrl ?? null,
      owner: doc.owner,
      accessType: doc.accessType,
      entitySource: doc.entitySource,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }
}
