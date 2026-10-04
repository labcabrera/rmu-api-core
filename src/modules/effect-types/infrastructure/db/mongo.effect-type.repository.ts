import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MongoBaseRepository } from 'src/modules/shared/infrastructure/db/mongo.base.repository';
import { RsqlParser } from 'src/modules/shared/infrastructure/persistence/repositories/rsql-parser';
import { EffectTypeRepository } from '../../application/ports/effect-type-repository';
import { EffectType } from '../../domain/aggregates/effect-type';
import { EffectTypeDocument, EffectTypeModel } from '../persistence/models/effect-type.model';

@Injectable()
export class MongoEffectTypeRepository extends MongoBaseRepository<EffectType, EffectTypeDocument> implements EffectTypeRepository {
  constructor(@InjectModel(EffectTypeModel.name) model: Model<EffectTypeDocument>, rsqlParser: RsqlParser) {
    super(model, rsqlParser);
  }

  protected mapToEntity(doc: EffectTypeDocument): EffectType {
    return EffectType.fromProps({
      id: doc.id as string,
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
