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

  protected mapToEntity(doc: EnumerationDocument): Enumeration {
    return Enumeration.fromProps({
      id: doc.id as string,
      name: doc.name,
      category: doc.category,
      owner: doc.owner,
      accessType: doc.accessType,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }
}
