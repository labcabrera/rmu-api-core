import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose/dist/common/mongoose.decorators';
import { LanguageRepository } from '../../application/ports/language-repository';
import { LanguageDocument, LanguageModel } from '../persistence/models/language-model';
import { Language } from '../../domain/aggregates/language';
import { RsqlParser } from 'src/modules/shared/infrastructure/persistence/repositories/rsql-parser';
import { MongoBaseRepository } from 'src/modules/shared/infrastructure/db/mongo.base.repository';
import { AccessType } from 'src/modules/shared/domain/entities/access-type';

@Injectable()
export class MongoLanguageRepository extends MongoBaseRepository<Language, LanguageDocument> implements LanguageRepository {
  constructor(@InjectModel(LanguageModel.name) languageModel: Model<LanguageDocument>, rsqlParser: RsqlParser) {
    super(languageModel, rsqlParser);
  }

  async updateRealmInfo(realmId: string, realmName: string, realmOwner: string, accessType: AccessType): Promise<void> {
    const now = new Date();
    const update = { 'realm.name': realmName, owner: realmOwner, accessType: accessType, updatedAt: now };
    await this.model.updateMany({ 'realm.id': realmId }, { $set: update }).exec();
  }

  protected mapToEntity(doc: LanguageDocument): Language {
    return Language.fromProps({
      id: doc.id as string,
      name: doc.name,
      realm: doc.realm,
      description: doc.description,
      owner: doc.owner,
      accessType: doc.accessType,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }
}
