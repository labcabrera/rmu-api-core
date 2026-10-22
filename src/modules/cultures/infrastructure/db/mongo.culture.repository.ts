import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RsqlParser } from '../../../shared/infrastructure/db/rsql-parser.js';
import { MongoBaseRepository } from '../../../shared/infrastructure/db/mongo.base.repository.js';
import { NotFoundError } from '../../../shared/domain/errors/errors.js';
import { type CultureDocument, CultureModel } from '../persistence/models/culture.model.js';
import type { CultureRepository } from '../../application/ports/culture-repository.port.js';
import { Culture } from '../../domain/aggregates/culture.js';
import { CultureSkillRank } from '../../domain/value-objects/culture-skill-rank.js';

@Injectable()
export class MongoCultureRepository extends MongoBaseRepository<Culture, CultureDocument> implements CultureRepository {
  constructor(@InjectModel(CultureModel.name) cultureModel: Model<CultureDocument>, rsqlParser: RsqlParser) {
    super(cultureModel, rsqlParser);
  }

  /** Writes only `skillRanks` and drops the old `fixedSkillRanks` field. */
  async update(entityId: string, entity: Partial<Culture>): Promise<Culture> {
    const props = entity.getProps ? entity.getProps() : entity;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, ...rest } = props;
    const updated = await this.model.findByIdAndUpdate(entityId, { $set: rest, $unset: { fixedSkillRanks: 1 } }, { new: true });
    if (!updated) throw new NotFoundError('Culture', entityId);
    return this.mapToEntity(updated);
  }

  protected mapToEntity(doc: CultureDocument): Culture {
    return Culture.fromProps({
      id: doc._id,
      name: doc.name,
      description: doc.description,
      imageUrl: doc.imageUrl,
      owner: doc.owner,
      accessType: doc.accessType,
      skillRanks: MongoCultureRepository.mapSkillRanks(doc),
      languages: doc.languages ? [...doc.languages] : undefined,
      suggestedCrafts: doc.suggestedCrafts ?? undefined,
      suggestedVocations: doc.suggestedVocations ?? undefined,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }

  /** Reads `skillRanks`, or the old `fixedSkillRanks` (as 'skill' entries) when it is absent. */
  static mapSkillRanks(doc: Pick<CultureModel, 'skillRanks' | 'fixedSkillRanks'>): CultureSkillRank[] {
    if (doc.skillRanks) {
      return doc.skillRanks.map(s =>
        CultureSkillRank.fromProps({
          type: s.type,
          skillId: s.skillId,
          skillIds: s.skillIds ? [...s.skillIds] : undefined,
          specialization: s.specialization,
          categoryIds: s.categoryIds ? [...s.categoryIds] : undefined,
          ranks: s.ranks,
          maxRanksPerSkill: s.maxRanksPerSkill,
          region: s.region,
        }),
      );
    }
    return (
      doc.fixedSkillRanks?.map(s =>
        CultureSkillRank.fromProps({ type: 'skill', skillId: s.skillId, specialization: s.specialization ?? undefined, ranks: s.ranks }),
      ) ?? []
    );
  }
}
