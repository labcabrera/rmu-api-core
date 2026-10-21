import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { type TraitDocument, TraitModel } from '../persistence/models/trait-model.js';
import type { TraitRepository } from '../../application/ports/trait.repository.js';
import { Trait } from '../../domain/aggregates/trait.js';
import { RsqlParser } from '../../../shared/infrastructure/persistence/repositories/rsql-parser.js';
import { MongoBaseRepository } from '../../../shared/infrastructure/db/mongo.base.repository.js';

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
