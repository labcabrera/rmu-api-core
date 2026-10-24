import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RsqlParser } from '../../../shared/infrastructure/db/rsql-parser.js';
import type { ProfessionRepository } from '../../application/ports/profession-repository.port.js';
import { type ProfessionDocument, ProfessionModel } from '../persistence/models/profession.model.js';
import { Profession } from '../../domain/aggregates/profession.js';
import { MongoBaseRepository } from '../../../shared/infrastructure/db/mongo.base.repository.js';

@Injectable()
export class MongoProfessionRepository extends MongoBaseRepository<Profession, ProfessionDocument> implements ProfessionRepository {
  constructor(@InjectModel(ProfessionModel.name) professionModel: Model<ProfessionDocument>, rsqlParser: RsqlParser) {
    super(professionModel, rsqlParser);
  }

  protected mapToEntity(doc: ProfessionDocument): Profession {
    return Profession.fromProps({
      id: doc._id,
      archetype: doc.archetype,
      availableRealmTypes: doc.availableRealmTypes,
      fixedRealmTypes: doc.fixedRealmTypes,
      skillCosts: doc.skillCosts,
      professionalSkills: doc.professionalSkills,
      entitySource: doc.entitySource,
      description: doc.description,
      imageUrl: doc.imageUrl,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
      owner: doc.owner,
      accessType: doc.accessType,
    });
  }
}
