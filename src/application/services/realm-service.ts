import { inject, injectable } from 'inversify';
import { Realm, CreateRealmRequest, UpdateRealmRequest } from '@domain/entities/Realm';
import { RealmRepository } from '@domain/ports/realm-repository';
import { PaginationOptions, PaginatedResult, NotFoundError, ConflictError } from '@shared/types';
import { TYPES } from '@shared/types/container';

@injectable()
export class RealmService {
  constructor(@inject(TYPES.RealmRepository) private realmRepository: RealmRepository) {}

  async findById(id: string): Promise<Realm> {
    const realm = await this.realmRepository.findById(id);
    if (!realm) {
      throw new NotFoundError('Realm', id);
    }
    return realm;
  }

  async findAll(options: PaginationOptions): Promise<PaginatedResult<Realm>> {
    return this.realmRepository.findAll(options);
  }

  async create(request: CreateRealmRequest): Promise<Realm> {
    const exists = await this.realmRepository.existsById(request.id);
    if (exists) {
      throw new ConflictError(`Realm with id '${request.id}' already exists`);
    }
    return this.realmRepository.save(request);
  }

  async update(id: string, request: UpdateRealmRequest): Promise<Realm> {
    const realm = await this.realmRepository.update(id, request);
    if (!realm) {
      throw new NotFoundError('Realm', id);
    }
    return realm;
  }

  async deleteById(id: string): Promise<void> {
    const deleted = await this.realmRepository.deleteById(id);
    if (!deleted) {
      throw new NotFoundError('Realm', id);
    }
  }
}
