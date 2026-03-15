import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose/dist/common/mongoose.decorators';
import { TraitDocument, TraitModel } from '../persistence/models/trait-model';
import { TraitRepository } from '../../application/ports/trait.repository';
import { Trait } from '../../domain/aggregates/trait';
import { RsqlParser } from 'src/modules/shared/infrastructure/persistence/repositories/rsql-parser';
import { MongoBaseRepository } from 'src/modules/shared/infrastructure/db/mongo.base.repository';

@Injectable()
export class MongoTraitRepository extends MongoBaseRepository<Trait, TraitDocument> implements TraitRepository {
  constructor(@InjectModel(TraitModel.name) traitModel: Model<TraitDocument>, rsqlParser: RsqlParser) {
    super(traitModel, rsqlParser);
  }

  protected mapToEntity(doc: TraitDocument): Trait {
    return Trait.fromProps({
      id: doc.id as string,
      name: doc.name,
      category: doc.category,
      isTalent: doc.isTalent,
      specialization: doc.specialization,
      isTierBased: doc.isTierBased,
      maxTier: doc.maxTier,
      adquisitionCost: doc.adquisitionCost,
      tierCost: doc.tierCost,
      description: doc.description,
      owner: doc.owner,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }
}
