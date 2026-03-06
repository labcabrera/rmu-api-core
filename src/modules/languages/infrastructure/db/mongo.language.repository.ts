import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose/dist/common/mongoose.decorators';
import { LanguageRepository } from '../../application/ports/language-repository';
import { LanguageDocument, LanguageModel } from '../persistence/models/language-model';
import { Language } from '../../domain/aggregates/language';
import { Page } from 'src/modules/shared/domain/entities/page';
import { RsqlParser } from 'src/modules/shared/infrastructure/persistence/repositories/rsql-parser';
import { NotFoundError } from 'src/modules/shared/domain/errors/errors';
import { NamedEntity } from 'src/modules/shared/infrastructure/persistence/models/named-entity.model';

@Injectable()
export class MongoLanguageRepository implements LanguageRepository {
  constructor(
    @InjectModel(LanguageModel.name) private LanguageModel: Model<LanguageDocument>,
    private rsqlParser: RsqlParser,
  ) {}

  async findById(id: string): Promise<Language | null> {
    const readed = await this.LanguageModel.findById(id);
    return readed ? this.mapToEntity(readed) : null;
  }

  async findByRsql(rsql: string, page: number, size: number): Promise<Page<Language>> {
    const skip = page * size;
    const mongoQuery = this.rsqlParser.parse(rsql);
    const [LanguagesDocs, totalElements] = await Promise.all([
      this.LanguageModel.find(mongoQuery).skip(skip).limit(size).sort({ name: 1 }),
      this.LanguageModel.countDocuments(mongoQuery),
    ]);
    const content = LanguagesDocs.map((doc) => this.mapToEntity(doc));
    return new Page<Language>(content, page, size, totalElements);
  }

  async save(Language: Partial<Language>): Promise<Language> {
    const model = new this.LanguageModel({ ...Language, _id: Language.id });
    await model.save();
    return this.mapToEntity(model);
  }

  async update(id: string, request: Partial<Language>): Promise<Language> {
    const updatedLanguage = await this.LanguageModel.findByIdAndUpdate(id, { $set: request }, { new: true });
    if (!updatedLanguage) {
      throw new NotFoundError('Language', id);
    }
    return this.mapToEntity(updatedLanguage);
  }

  async deleteById(id: string): Promise<Language | null> {
    const result = await this.LanguageModel.findByIdAndDelete(id);
    return result ? this.mapToEntity(result) : null;
  }

  async existsById(id: string): Promise<boolean> {
    const exists = await this.LanguageModel.exists({ _id: id });
    return exists !== null;
  }

  private mapToEntity(doc: LanguageDocument): Language {
    return Language.fromProps({
      id: doc.id as string,
      name: doc.name,
      realm: doc.realm,
      description: doc.description,
      owner: doc.owner,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }
}
