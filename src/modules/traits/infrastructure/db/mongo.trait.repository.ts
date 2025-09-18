import { Injectable } from '@nestjs/common';
import { Page } from 'src/modules/core/domain/entities/page';
import { RsqlParser } from '../../../core/infrastructure/persistence/repositories/rsql-parser';
import { NotFoundError } from 'src/modules/core/domain/errors/errors';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose/dist/common/mongoose.decorators';
import { TraitDocument, TraitModel } from '../persistence/models/trait-model';
import { TraitRepository } from '../../application/ports/trait.repository';
import { Trait } from '../../domain/aggregates/trait';

@Injectable()
export class MongoTraitRepository implements TraitRepository {
  constructor(
    @InjectModel(TraitModel.name) private traitModel: Model<TraitDocument>,
    private rsqlParser: RsqlParser,
  ) {}

  async findById(id: string): Promise<Trait | null> {
    const readed = await this.traitModel.findById(id);
    return readed ? this.mapToEntity(readed) : null;
  }

  async findByRsql(rsql: string, page: number, size: number): Promise<Page<Trait>> {
    const skip = page * size;
    const mongoQuery = this.rsqlParser.parse(rsql);
    const [traitsDocs, totalElements] = await Promise.all([
      this.traitModel.find(mongoQuery).skip(skip).limit(size).sort({ name: 1 }),
      this.traitModel.countDocuments(mongoQuery),
    ]);
    const content = traitsDocs.map((doc) => this.mapToEntity(doc));
    return new Page<Trait>(content, page, size, totalElements);
  }

  async save(trait: Partial<Trait>): Promise<Trait> {
    const model = new this.traitModel({ ...trait, _id: trait.id });
    await model.save();
    return this.mapToEntity(model);
  }

  async update(id: string, request: Partial<Trait>): Promise<Trait> {
    const updatedTrait = await this.traitModel.findByIdAndUpdate(id, { $set: request }, { new: true });
    if (!updatedTrait) {
      throw new NotFoundError('Trait', id);
    }
    return this.mapToEntity(updatedTrait);
  }

  async deleteById(id: string): Promise<Trait | null> {
    const result = await this.traitModel.findByIdAndDelete(id);
    return result ? this.mapToEntity(result) : null;
  }

  async existsById(id: string): Promise<boolean> {
    const exists = await this.traitModel.exists({ _id: id });
    return exists !== null;
  }

  private mapToEntity(doc: TraitDocument): Trait {
    return Trait.fromProps({
      id: doc.id as string,
      isTalent: doc.isTalent,
      requiresSpecialization: doc.requiresSpecialization,
      cost: doc.cost,
      description: doc.description,
      owner: doc.owner,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }
}
