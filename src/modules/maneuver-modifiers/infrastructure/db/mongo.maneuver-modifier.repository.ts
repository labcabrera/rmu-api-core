import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { QueryCriteria } from 'src/modules/shared/application/criteria/query-criteria';
import { NotFoundError } from 'src/modules/shared/domain/errors/errors';
import { MongoBaseRepository } from 'src/modules/shared/infrastructure/db/mongo.base.repository';
import { MongoQueryCriteriaMapper } from 'src/modules/shared/infrastructure/persistence/repositories/mongo-query-criteria.mapper';
import { RsqlParser } from 'src/modules/shared/infrastructure/persistence/repositories/rsql-parser';
import { ManeuverModifierRepository } from '../../application/ports/maneuver-modifier-repository';
import { ManeuverModifier } from '../../domain/aggregates/maneuver-modifier';
import { ManeuverModifierDocument, ManeuverModifierModel } from '../persistence/models/maneuver-modifier.model';

const OPTIONAL_FIELDS = ['value', 'options', 'perUnit', 'min', 'max', 'description', 'updatedAt'] as const;

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
    return doc ? this.mapToEntity(doc) : null;
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
    return docs.map(doc => this.mapToEntity(doc));
  }

  /** Full update: optional fields that are no longer set (e.g. after a type change) are removed. */
  async update(entityId: string, entity: ManeuverModifier): Promise<ManeuverModifier> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, ...props } = entity.getProps();
    const $set: Record<string, unknown> = {};
    const $unset: Record<string, ''> = {};
    Object.entries(props).forEach(([field, value]) => {
      if (value === undefined) {
        if ((OPTIONAL_FIELDS as readonly string[]).includes(field)) $unset[field] = '';
      } else {
        $set[field] = value;
      }
    });
    const update = Object.keys($unset).length > 0 ? { $set, $unset } : { $set };
    const updated = await this.modifierModel.findByIdAndUpdate(entityId, update, { new: true });
    if (!updated) throw new NotFoundError('ManeuverModifier', entityId);
    return this.mapToEntity(updated);
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
