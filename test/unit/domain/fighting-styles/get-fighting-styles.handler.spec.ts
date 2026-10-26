import { describe, expect, it } from 'vitest';
import { GetFightingStylesHandler } from '../../../../src/modules/fighting-styles/application/cqrs/handlers/get-fighting-styles.handler.js';
import { GetFightingStylesQuery } from '../../../../src/modules/fighting-styles/application/cqrs/queries/get-fighting-styles.query.js';
import type { FightingStylesRepository } from '../../../../src/modules/fighting-styles/application/ports/fighting-styles-repository.port.js';
import type { FightingStyleCatalog } from '../../../../src/modules/fighting-styles/domain/value-objects/fighting-styles.vo.js';
import { MongoFightingStylesRepository } from '../../../../src/modules/fighting-styles/infrastructure/db/mongo.fighting-styles.repository.js';
import { FightingStylesModel } from '../../../../src/modules/fighting-styles/infrastructure/persistence/models/fighting-styles.model.js';
import { ForbiddenError, NotFoundError } from '../../../../src/modules/shared/domain/errors/errors.js';

// Fixture values, not the rulebook ones
const CATALOG: FightingStyleCatalog = {
  styles: [
    {
      id: 'test-style',
      skillId: 'combat-styles',
      abilities: [{ abilityId: 'test-ability', cost: 2 }],
      requiresSkills: [],
      requiresTraits: [],
      equipment: [[{ kind: 'weapon-tag', value: 'test' }]],
    },
  ],
  abilities: [
    {
      id: 'test-ability',
      types: ['combat'],
      repeatable: false,
      maxTimes: null,
      requiresAbilities: [],
      requiresSkills: [],
      requiresTraits: [],
      equipment: [],
      description: 'Test text.',
    },
  ],
};

const repository = (catalog: FightingStyleCatalog | null): FightingStylesRepository => ({ findById: () => Promise.resolve(catalog) });

describe('GetFightingStylesHandler', () => {
  it('returns the catalog to users with Core Law access', async () => {
    const handler = new GetFightingStylesHandler(repository(CATALOG));
    await expect(handler.execute(new GetFightingStylesQuery('user', ['rmu-core-law']))).resolves.toEqual(CATALOG);
  });

  it('rejects users without Core Law access', async () => {
    const handler = new GetFightingStylesHandler(repository(CATALOG));
    await expect(handler.execute(new GetFightingStylesQuery('user', []))).rejects.toBeInstanceOf(ForbiddenError);
  });

  it('answers not found while the catalog has not been imported', async () => {
    const handler = new GetFightingStylesHandler(repository(null));
    await expect(handler.execute(new GetFightingStylesQuery('user', ['rmu-admin']))).rejects.toBeInstanceOf(NotFoundError);
  });
});

describe('MongoFightingStylesRepository.mapToCatalog', () => {
  it('fills the missing lists and limits of older documents', () => {
    const doc = {
      _id: 'test',
      styles: [{ id: 'test-style', skillId: 'battle-styles', abilities: [{ abilityId: 'a', cost: 4 }] }],
      abilities: [{ id: 'a', types: ['battle'] }],
    } as unknown as FightingStylesModel;
    expect(MongoFightingStylesRepository.mapToCatalog(doc)).toEqual({
      styles: [
        {
          id: 'test-style',
          skillId: 'battle-styles',
          abilities: [{ abilityId: 'a', cost: 4 }],
          requiresSkills: [],
          requiresTraits: [],
          equipment: [],
        },
      ],
      abilities: [
        {
          id: 'a',
          types: ['battle'],
          repeatable: false,
          maxTimes: null,
          requiresAbilities: [],
          requiresSkills: [],
          requiresTraits: [],
          equipment: [],
          description: null,
        },
      ],
    });
  });
});
