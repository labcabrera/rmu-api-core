import { inject, injectable } from 'inversify';
import { Realm, UpdateRealmRequest } from '@domain/entities/realm';
import { RealmRepository } from '@domain/ports/realm-repository';
import { RealmQuery } from '@domain/queries/realm-query';
import { Page } from '@domain/entities/page';
import { NotFoundError, ValidationError } from '@domain/errors/errors';

@injectable()
export class RealmService {
  constructor(@inject('RealmRepository') private realmRepository: RealmRepository) {}

  async findById(id: string): Promise<Realm> {
    const realm = await this.realmRepository.findById(id);
    if (!realm) {
      throw new NotFoundError('Realm', id);
    }
    return realm;
  }

  async findAll(query: RealmQuery): Promise<Page<Realm>> {
    return this.realmRepository.find(query);
  }

  async update(id: string, request: UpdateRealmRequest): Promise<Realm> {
    const realm = await this.realmRepository.update(id, request);
    if (!realm) {
      throw new ValidationError(`Realm ${id} not found`);
    }
    return realm;
  }

  async deleteById(id: string): Promise<void> {
    await this.realmRepository.deleteById(id);
  }
}
