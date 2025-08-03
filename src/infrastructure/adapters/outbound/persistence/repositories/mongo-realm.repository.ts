import { injectable } from 'inversify';
import { Realm, CreateRealmRequest, UpdateRealmRequest } from '@domain/entities/realm';
import { RealmRepository } from '@domain/ports/realm-repository';
import { RealmModel, RealmDocument } from '../models/RealmModel';
import { RealmQuery } from '@domain/queries/realm-query';
import { Page } from '@domain/entities/page';
import { NotFoundError } from '@domain/errors/errors';

@injectable()
export class MongoRealmRepository implements RealmRepository {
  async findById(id: string): Promise<Realm | null> {
    const readed = await RealmModel.findById(id);
    return readed ? this.mapToEntity(readed) : null;
  }

  async find(query: RealmQuery): Promise<Page<Realm>> {
    const skip = query.page * query.size;
    const [realmsDocs, totalElements] = await Promise.all([
      RealmModel.find().skip(skip).limit(query.size).sort({ name: 1 }),
      RealmModel.countDocuments(),
    ]);
    const content = realmsDocs.map(doc => this.mapToEntity(doc));
    return {
      content,
      pagination: {
        page: query.page,
        size: query.size,
        totalElements,
        totalPages: Math.ceil(totalElements / query.size),
      },
    };
  }

  async save(request: CreateRealmRequest): Promise<Realm> {
    const realmDoc = new RealmModel({
      _id: request.id,
      name: request.name,
      description: request.description,
    });

    const savedRealm = await realmDoc.save();
    return this.mapToEntity(savedRealm);
  }

  async update(id: string, request: UpdateRealmRequest): Promise<Realm> {
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
