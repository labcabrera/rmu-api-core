import { Injectable } from '@nestjs/common';
import { RealmRepository } from 'src/modules/realms/application/ports/out/realm-repository';
import { Page } from 'src/modules/core/domain/entities/page';
import { Realm } from 'src/modules/realms/domain/aggregates/realm';
import { RealmModel, RealmDocument } from '../persistence/models/realm-model';
import { RsqlParser } from '../../../core/infrastructure/persistence/repositories/rsql-parser';
import { NotFoundError } from 'src/modules/core/domain/errors/errors';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose/dist/common/mongoose.decorators';

@Injectable()
export class MongoRealmRepository implements RealmRepository {
  constructor(
    @InjectModel(RealmModel.name) private realmModel: Model<RealmDocument>,
    private rsqlParser: RsqlParser,
  ) {}

  async findById(id: string): Promise<Realm | null> {
    const readed = await this.realmModel.findById(id);
    return readed ? this.mapToEntity(readed) : null;
  }

  async findByRsql(rsql: string, page: number, size: number): Promise<Page<Realm>> {
    const skip = page * size;
    const mongoQuery = this.rsqlParser.parse(rsql);
    const [realmsDocs, totalElements] = await Promise.all([
      this.realmModel.find(mongoQuery).skip(skip).limit(size).sort({ name: 1 }),
      this.realmModel.countDocuments(mongoQuery),
    ]);
    const content = realmsDocs.map((doc) => this.mapToEntity(doc));
    return new Page<Realm>(content, page, size, totalElements);
  }

  async save(realm: Partial<Realm>): Promise<Realm> {
    const model = new this.realmModel({ ...realm, _id: realm.id });
    await model.save();
    return this.mapToEntity(model);
  }

  async update(id: string, request: Partial<Realm>): Promise<Realm> {
    const updatedRealm = await this.realmModel.findByIdAndUpdate(id, { $set: request }, { new: true });
    if (!updatedRealm) {
      throw new NotFoundError('Realm', id);
    }
    return this.mapToEntity(updatedRealm);
  }

  async deleteById(id: string): Promise<Realm | null> {
    const result = await this.realmModel.findByIdAndDelete(id);
    return result ? this.mapToEntity(result) : null;
  }

  async existsById(id: string): Promise<boolean> {
    const exists = await this.realmModel.exists({ _id: id });
    return exists !== null;
  }

  private mapToEntity(doc: RealmDocument): Realm {
    return Realm.fromProps({
      id: doc.id as string,
      name: doc.name,
      description: doc.description,
      owner: doc.owner,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }
}
