import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import type { SkillRepository } from '../../application/ports/skill-repository.port.js';
import { Skill } from '../../domain/aggregates/skill.js';
import { type SkillDocument, SkillModel } from '../persistence/models/skill.model.js';
import { RsqlParser } from '../../../shared/infrastructure/db/rsql-parser.js';
import { MongoBaseRepository } from '../../../shared/infrastructure/db/mongo.base.repository.js';

@Injectable()
export class MongoSkillRepository extends MongoBaseRepository<Skill, SkillDocument> implements SkillRepository {
  constructor(@InjectModel(SkillModel.name) skillModel: Model<SkillDocument>, rsqlParser: RsqlParser) {
    super(skillModel, rsqlParser);
  }

  protected mapToEntity(doc: SkillDocument): Skill {
    return Skill.fromProps({
      id: doc.id as string,
      categoryId: doc.categoryId,
      bonus: doc.bonus,
      specialization: doc.specialization,
      owner: doc.owner,
      accessType: doc.accessType,
      maneuver: doc.maneuver ?? undefined,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }
}
