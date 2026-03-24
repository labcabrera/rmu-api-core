import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SkillRepository } from '../../application/ports/skill-repository';
import { Skill } from '../../domain/aggregates/skill';
import { SkillDocument, SkillModel } from '../persistence/models/skill.model';
import { RsqlParser } from 'src/modules/shared/infrastructure/persistence/repositories/rsql-parser';
import { MongoBaseRepository } from 'src/modules/shared/infrastructure/db/mongo.base.repository';

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
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }
}
