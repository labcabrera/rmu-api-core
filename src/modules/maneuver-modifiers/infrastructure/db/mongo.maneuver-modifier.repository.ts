import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { type FilterQuery, Model } from 'mongoose';
import { QueryCriteria } from '../../../shared/application/criteria/query-criteria.js';
import { MongoBaseRepository } from '../../../shared/infrastructure/db/mongo.base.repository.js';
import { MongoQueryCriteriaMapper } from '../../../shared/infrastructure/db/mongo-query-criteria.mapper.js';
import { RsqlParser } from '../../../shared/infrastructure/db/rsql-parser.js';
import type { ManeuverModifierRepository } from '../../application/ports/maneuver-modifier-repository.port.js';
import { ManeuverModifier } from '../../domain/aggregates/maneuver-modifier.js';
import { type ManeuverModifierDocument, ManeuverModifierModel } from '../persistence/models/maneuver-modifier.model.js';

@Injectable()
export class MongoManeuverModifierRepository
  extends MongoBaseRepository<ManeuverModifier, ManeuverModifierDocument>
  implements ManeuverModifierRepository
{
  constructor(
    @InjectModel(ManeuverModifierModel.name) private readonly modifierModel: Model<ManeuverModifierDocument>,
    rsqlParser: RsqlParser,
  ) {
    super(modifierModel, rsqlParser);
  }

  async findByKey(key: string): Promise<ManeuverModifier | null> {
    const doc = await this.modifierModel.findOne({ key });
    return doc ? this.toEntity(doc) : null;
  }

  async findApplicable(skillId: string | undefined, categoryId: string | undefined, filter?: QueryCriteria): Promise<ManeuverModifier[]> {
    const scope: FilterQuery<ManeuverModifierDocument>[] = [];
    if (skillId) scope.push({ 'scope.skillIds': skillId });
    if (categoryId) scope.push({ 'scope.categoryIds': categoryId });
    if (scope.length === 0) return [];
    const accessFilter = MongoQueryCriteriaMapper.toFilterQuery(filter);
    const query: FilterQuery<ManeuverModifierDocument> =
      Object.keys(accessFilter).length === 0 ? { $or: scope } : { $and: [{ $or: scope }, accessFilter] };
    const docs = await this.modifierModel.find(query).sort({ key: 1 });
    return docs.map(doc => this.toEntity(doc));
  }

  protected mapToEntity(doc: ManeuverModifierDocument): ManeuverModifier {
    return ManeuverModifier.fromProps({
      id: doc.id as string,
      key: doc.key,
      scope: {
        ...(doc.scope?.skillIds?.length ? { skillIds: doc.scope.skillIds } : {}),
        ...(doc.scope?.categoryIds?.length ? { categoryIds: doc.scope.categoryIds } : {}),
      },
      type: doc.type,
      value: doc.value ?? undefined,
      options: doc.options?.map(option => ({ key: option.key, value: option.value })),
      perUnit: doc.perUnit ?? undefined,
      min: doc.min ?? undefined,
      max: doc.max ?? undefined,
      description: doc.description ?? undefined,
      owner: doc.owner,
      accessType: doc.accessType,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }
}
