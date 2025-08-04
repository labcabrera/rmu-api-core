import { injectable } from 'inversify';
import { Realm } from '@domain/entities/realm';
import { RealmRepository } from '@domain/ports/outbound/realm-repository';
import { RealmModel, RealmDocument } from '../models/realm-model';
import { Page } from '@domain/entities/page';
import { NotFoundError } from '@domain/errors/errors';
import { toMongoQuery } from './rsql-adapter';

@injectable()
export class MongoRealmRepository implements RealmRepository {
  async findById(id: string): Promise<Realm | null> {
    const readed = await RealmModel.findById(id);
    return readed ? this.mapToEntity(readed) : null;
  }

  async findByRsql(rsql: string, page: number, size: number): Promise<Page<Realm>> {
    const skip = page * size;
    const mongoQuery = toMongoQuery(rsql);
    const [realmsDocs, totalElements] = await Promise.all([
      RealmModel.find(mongoQuery).skip(skip).limit(size).sort({ name: 1 }),
      RealmModel.countDocuments(mongoQuery),
    ]);
    const content = realmsDocs.map(doc => this.mapToEntity(doc));
    return {
      content,
      pagination: {
        page: page,
        size: size,
        totalElements,
        totalPages: Math.ceil(totalElements / size),
      },
    };
  }

  async save(request: Partial<Realm>): Promise<Realm> {
    const realmDoc = new RealmModel({
      _id: request.id,
      name: request.name,
      owner: request.owner,
      createdAt: request.createdAt,
      description: request.description,
    });

    const savedRealm = await realmDoc.save();
    return this.mapToEntity(savedRealm);
  }

  async update(id: string, request: Partial<Realm>): Promise<Realm> {
    const updatedRealm = await RealmModel.findByIdAndUpdate(id, { $set: request }, { new: true });
    if (!updatedRealm) {
      throw new NotFoundError('Realm', id);
    }
    return this.mapToEntity(updatedRealm);
  }

  async deleteById(id: string): Promise<void> {
    const result = await RealmModel.findByIdAndDelete(id);
    if (!result) {
      throw new NotFoundError('Realm', id);
    }
  }

  async existsById(id: string): Promise<boolean> {
    const exists = await RealmModel.exists({ _id: id });
    return exists !== null;
  }

  private mapToEntity(doc: RealmDocument): Realm {
    return {
      id: doc._id,
      name: doc.name,
      description: doc.description,
      owner: doc.owner,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }
}
