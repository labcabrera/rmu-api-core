import { injectable } from 'inversify';
import { Realm, CreateRealmRequest, UpdateRealmRequest } from '@domain/entities/Realm';
import { RealmRepository } from '@domain/ports/RealmRepository';
import { PaginationOptions, PaginatedResult } from '@shared/types';

@injectable()
export class InMemoryRealmRepository implements RealmRepository {
  private realms: Realm[] = [
    {
      id: 'essence',
      name: 'Essence',
      description: 'The realm of pure magical energy and elemental forces',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    },
    {
      id: 'channeling',
      name: 'Channeling',
      description: 'The realm of divine magic and spiritual power',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    },
    {
      id: 'mentalism',
      name: 'Mentalism',
      description: 'The realm of mental magic and psychic abilities',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    },
    {
      id: 'hybrid',
      name: 'Hybrid',
      description: 'A combination of multiple magical realms',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    },
  ];

  async findById(id: string): Promise<Realm | null> {
    const realm = this.realms.find(r => r.id === id);
    return realm || null;
  }

  async findAll(options: PaginationOptions): Promise<PaginatedResult<Realm>> {
    const skip = options.page * options.size;
    const content = this.realms.slice(skip, skip + options.size);

    return {
      content,
      pagination: {
        page: options.page,
        size: options.size,
        totalElements: this.realms.length,
      },
    };
  }

  async save(request: CreateRealmRequest): Promise<Realm> {
    const realm: Realm = {
      ...request,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.realms.push(realm);
    return realm;
  }

  async update(id: string, request: UpdateRealmRequest): Promise<Realm | null> {
    const index = this.realms.findIndex(r => r.id === id);
    if (index === -1) {
      return null;
    }

    this.realms[index] = {
      ...this.realms[index],
      ...request,
      updatedAt: new Date(),
    };

    return this.realms[index];
  }

  async deleteById(id: string): Promise<boolean> {
    const index = this.realms.findIndex(r => r.id === id);
    if (index === -1) {
      return false;
    }

    this.realms.splice(index, 1);
    return true;
  }

  async existsById(id: string): Promise<boolean> {
    return this.realms.some(r => r.id === id);
  }
}
