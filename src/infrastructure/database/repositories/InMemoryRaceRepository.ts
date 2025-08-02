import { injectable } from 'inversify';
import { Race, CreateRaceRequest, UpdateRaceRequest } from '@domain/entities/Race';
import { RaceRepository } from '@domain/ports/RaceRepository';
import { PaginationOptions, PaginatedResult } from '@shared/types';

@injectable()
export class InMemoryRaceRepository implements RaceRepository {
  private races: Race[] = [
    {
      id: 'common-human',
      name: 'Common Human',
      realm: 'essence',
      size: 'medium',
      defaultStatBonus: {
        ag: 0,
        co: 0,
        em: 0,
        in: 0,
        me: 0,
        pr: 0,
        qu: 0,
        re: 0,
        sd: 0,
        st: 0,
      },
      resistances: {
        channeling: 0,
        mentalism: 0,
        essence: 0,
        physical: 0,
      },
      strideBonus: 0,
      enduranceBonus: 0,
      recoveryMultiplier: 1,
      baseHits: 0,
      bonusDevPoints: 0,
      description: 'Standard human with no racial bonuses',
    },
    {
      id: 'wood-elf',
      name: 'Wood Elf',
      realm: 'channeling',
      size: 'medium',
      defaultStatBonus: {
        ag: 5,
        co: -5,
        em: 0,
        in: 0,
        me: 0,
        pr: 0,
        qu: 5,
        re: 0,
        sd: 0,
        st: -5,
      },
      resistances: {
        channeling: 15,
        mentalism: 0,
        essence: 0,
        physical: 0,
      },
      strideBonus: 0,
      enduranceBonus: 0,
      recoveryMultiplier: 1,
      baseHits: 0,
      bonusDevPoints: 0,
      description: 'Agile forest dwellers with natural magic resistance',
    },
  ];

  async findById(id: string): Promise<Race | null> {
    const race = this.races.find(r => r.id === id);
    return race || null;
  }

  async findAll(options: PaginationOptions): Promise<PaginatedResult<Race>> {
    const skip = options.page * options.size;
    const content = this.races.slice(skip, skip + options.size);

    return {
      content,
      pagination: {
        page: options.page,
        size: options.size,
        totalElements: this.races.length,
      },
    };
  }

  async save(request: CreateRaceRequest): Promise<Race> {
    const race: Race = {
      ...request,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.races.push(race);
    return race;
  }

  async update(id: string, request: UpdateRaceRequest): Promise<Race | null> {
    const index = this.races.findIndex(r => r.id === id);
    if (index === -1) {
      return null;
    }

    this.races[index] = {
      ...this.races[index],
      ...request,
      updatedAt: new Date(),
    };

    return this.races[index];
  }

  async deleteById(id: string): Promise<boolean> {
    const index = this.races.findIndex(r => r.id === id);
    if (index === -1) {
      return false;
    }

    this.races.splice(index, 1);
    return true;
  }

  async existsById(id: string): Promise<boolean> {
    return this.races.some(r => r.id === id);
  }
}
