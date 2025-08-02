import { injectable } from 'inversify';
import { Realm, CreateRealmRequest, UpdateRealmRequest } from '@domain/entities/Realm';
import { RealmRepository } from '@domain/ports/RealmRepository';
import { PaginationOptions, PaginatedResult } from '@shared/types';
import { RealmModel, RealmDocument } from '../models/RealmModel';

@injectable()
export class MongoRealmRepository implements RealmRepository {
  async findById(id: string): Promise<Realm | null> {
    const realmDoc = await RealmModel.findById(id);
    return realmDoc ? this.mapToEntity(realmDoc) : null;
  }

  async findAll(options: PaginationOptions): Promise<PaginatedResult<Realm>> {
    const skip = options.page * options.size;
    const [realmsDocs, totalElements] = await Promise.all([
      RealmModel.find().skip(skip).limit(options.size).sort({ name: 1 }),
      RealmModel.countDocuments(),
    ]);

    const content = realmsDocs.map(doc => this.mapToEntity(doc));

    return {
      content,
      pagination: {
        page: options.page,
        size: options.size,
        totalElements,
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

  async update(id: string, request: UpdateRealmRequest): Promise<Realm | null> {
    const updatedRealm = await RealmModel.findByIdAndUpdate(id, { $set: request }, { new: true });
    return updatedRealm ? this.mapToEntity(updatedRealm) : null;
  }

  async deleteById(id: string): Promise<boolean> {
    const result = await RealmModel.findByIdAndDelete(id);
    return result !== null;
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
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }
}
