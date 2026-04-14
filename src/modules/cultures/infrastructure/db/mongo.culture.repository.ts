import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RsqlParser } from 'src/modules/shared/infrastructure/persistence/repositories/rsql-parser';
import { MongoBaseRepository } from 'src/modules/shared/infrastructure/db/mongo.base.repository';
import { CultureDocument, CultureModel } from '../persistence/models/culture-model';
import { CultureRepository } from '../../application/ports/culture-repository';
import { Culture } from '../../domain/aggregates/culture';
import { CultureSkillRank } from '../../domain/value-objects/culture-skill-rank';

@Injectable()
export class MongoCultureRepository extends MongoBaseRepository<Culture, CultureDocument> implements CultureRepository {
  constructor(@InjectModel(CultureModel.name) raceModel: Model<CultureDocument>, rsqlParser: RsqlParser) {
    super(raceModel, rsqlParser);
  }

  protected mapToEntity(doc: CultureDocument): Culture {
    return Culture.fromProps({
      id: doc._id,
      name: doc.name,
      description: doc.description,
      imageUrl: doc.imageUrl,
      owner: doc.owner,
      accessType: doc.accessType,
      fixedSkillRanks: doc.fixedSkillRanks?.map(s => new CultureSkillRank(s.skillId, s.specialization ?? null, s.ranks)) ?? [],
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }
}
