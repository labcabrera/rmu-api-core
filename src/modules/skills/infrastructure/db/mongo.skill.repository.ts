import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SkillRepository } from '../../application/ports/skill-repository';
import { Skill } from '../../domain/aggregates/skill';
import { SkillDocument, SkillModel } from '../persistence/skill.model';
import { Page } from 'src/modules/shared/domain/entities/page';
import { RsqlParser } from 'src/modules/shared/infrastructure/persistence/repositories/rsql-parser';

@Injectable()
export class MongoSkillRepository implements SkillRepository {
  constructor(
    @InjectModel(SkillModel.name) private skillModel: Model<SkillDocument>,
    private rsqlParser: RsqlParser,
  ) {}

  async findById(id: string): Promise<Skill | null> {
    const doc = await this.skillModel.findById(id);
    return doc ? this.mapToEntity(doc) : null;
  }

  async findByRsql(rsql: string | undefined, page: number, size: number): Promise<Page<Skill>> {
    const skip = page * size;
    const mongoQuery = this.rsqlParser.parse(rsql || '');
    const [docs, totalElements] = await Promise.all([
      this.skillModel.find(mongoQuery).skip(skip).limit(size).sort({ _id: 1 }),
      this.skillModel.countDocuments(mongoQuery),
    ]);
    const content = docs.map((doc) => this.mapToEntity(doc));
    return new Page<Skill>(content, page, size, totalElements);
  }

  async save(entity: Skill): Promise<Skill> {
    const model = new this.skillModel({ ...entity, _id: entity.id });
    await model.save();
    return this.mapToEntity(model);
  }

  private mapToEntity(doc: SkillDocument): Skill {
    return {
      id: (doc as any)._id ? (doc as any)._id.toString() : (doc as any).id,
      categoryId: doc.categoryId,
      bonus: doc.bonus,
      specialization: doc.specialization as any,
    };
  }
}
