import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SkillRepository } from '../../application/ports/skill-repository';
import { Skill } from '../../domain/aggregates/skill';
import { SkillDocument, SkillModel } from '../persistence/models/skill.model';
import { RsqlParser } from '../../../shared/infrastructure/persistence/repositories/rsql-parser';
import { NotFoundError } from '../../../shared/domain/errors/errors';
import { MongoBaseRepository } from '../../../shared/infrastructure/db/mongo.base.repository';

@Injectable()
export class MongoSkillRepository extends MongoBaseRepository<Skill, SkillDocument> implements SkillRepository {
  constructor(@InjectModel(SkillModel.name) skillModel: Model<SkillDocument>, rsqlParser: RsqlParser) {
    super(skillModel, rsqlParser);
  }

  /** Same as the base update, but removes the maneuver profile when the skill no longer has one. */
  async update(entityId: string, entity: Skill): Promise<Skill> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, maneuver, ...rest } = entity.getProps();
    const update = maneuver ? { $set: { ...rest, maneuver } } : { $set: rest, $unset: { maneuver: '' } };
    const updated = await this.model.findByIdAndUpdate(entityId, update, { new: true });
    if (!updated) throw new NotFoundError('Skill', entityId);
    return this.mapToEntity(updated);
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
