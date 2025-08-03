import { inject, injectable } from 'inversify';
import { Realm } from '@domain/entities/realm';
import { RealmRepository } from '@domain/ports/realm-repository';
import { RealmQuery } from '@domain/queries/realm-query';
import { Page } from '@domain/entities/page';

@injectable()
export class RealmReadService {
  constructor(@inject('RealmRepository') private realmRepository: RealmRepository) {}

  async findById(id: string): Promise<Realm> {
    const realm = await this.realmRepository.findById(id);
    if (!realm) {
      throw new Error('Realm not found');
    }
    return realm;
  }

  async find(query: RealmQuery): Promise<Page<Realm>> {
    return this.realmRepository.find(query);
  }
}
