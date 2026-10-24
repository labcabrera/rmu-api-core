import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MongoBaseRepository } from '../../../shared/infrastructure/db/mongo.base.repository.js';
import { RsqlParser } from '../../../shared/infrastructure/db/rsql-parser.js';
import type { EffectTypeRepository } from '../../application/ports/effect-type-repository.port.js';
import { EffectType } from '../../domain/aggregates/effect-type.js';
import { type EffectTypeDocument, EffectTypeModel } from '../persistence/models/effect-type.model.js';

@Injectable()
export class MongoEffectTypeRepository extends MongoBaseRepository<EffectType, EffectTypeDocument> implements EffectTypeRepository {
  constructor(@InjectModel(EffectTypeModel.name) model: Model<EffectTypeDocument>, rsqlParser: RsqlParser) {
    super(model, rsqlParser);
  }

  protected mapToEntity(doc: EffectTypeDocument): EffectType {
    return EffectType.fromProps({
      id: doc._id,
      isPersistent: doc.isPersistent,
      isStackable: doc.isStackable,
      value: doc.value,
      modifier: doc.modifier,
      rounds: doc.rounds,
      text: doc.text,
      location: doc.location,
      delay: doc.delay,
      owner: doc.owner,
      accessType: doc.accessType,
      entitySource: doc.entitySource,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }
}
