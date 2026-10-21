import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SkillCategoryRepository } from '../../../realms/application/ports/skill-category-repository';
import { Page } from '../../../shared/domain/entities/page';
import { SkillCategory } from '../../domain/entities/skill-category';
import { SkillCategoryDocument, SkillCategoryModel } from '../persistence/models/skill-category.model';
import { ManeuverProfiles } from '../../domain/value-objects/maneuver-profile.vo';
import { RsqlParser } from '../../../shared/infrastructure/persistence/repositories/rsql-parser';

@Injectable()
export class MongoSkillCategoryRepository implements SkillCategoryRepository {
  constructor(
    @InjectModel(SkillCategoryModel.name) private skillCategoryModel: Model<SkillCategoryDocument>,
    private rsqlParser: RsqlParser,
  ) {}

  async findById(id: string): Promise<SkillCategory | null> {
    const doc = await this.skillCategoryModel.findById(id);
    return doc ? this.mapToEntity(doc) : null;
  }

  async findByIds(ids: string[]): Promise<SkillCategory[]> {
    if (ids.length === 0) return [];
    const docs = await this.skillCategoryModel.find({ _id: { $in: ids } });
    return docs.map(doc => this.mapToEntity(doc));
  }

  async findByRsql(rsql: string | undefined, page: number, size: number): Promise<Page<SkillCategory>> {
    const skip = page * size;
    const mongoQuery = this.rsqlParser.parse(rsql || '');
    const [docs, totalElements] = await Promise.all([
      this.skillCategoryModel.find(mongoQuery).skip(skip).limit(size).sort({ _id: 1 }),
      this.skillCategoryModel.countDocuments(mongoQuery),
    ]);
    const content = docs.map(doc => this.mapToEntity(doc));
    return new Page<SkillCategory>(content, page, size, totalElements);
  }

  async save(entity: SkillCategory): Promise<SkillCategory> {
    const model = new this.skillCategoryModel({ ...entity, _id: entity.id });
    await model.save();
    return this.mapToEntity(model);
  }

  private mapToEntity(doc: SkillCategoryDocument): SkillCategory {
    return new SkillCategory(doc.id as string, doc.bonus, doc.realmBonus ?? null, ManeuverProfiles.normalize(doc.maneuver));
  }
}
