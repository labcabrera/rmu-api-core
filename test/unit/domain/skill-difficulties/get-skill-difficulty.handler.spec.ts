import { describe, expect, it } from 'vitest';
import { GetSkillDifficultiesHandler } from '../../../../src/modules/skill-difficulties/application/cqrs/handlers/get-skill-difficulties.handler.js';
import { GetSkillDifficultyHandler } from '../../../../src/modules/skill-difficulties/application/cqrs/handlers/get-skill-difficulty.handler.js';
import { GetSkillDifficultiesQuery } from '../../../../src/modules/skill-difficulties/application/cqrs/queries/get-skill-difficulties.query.js';
import { GetSkillDifficultyQuery } from '../../../../src/modules/skill-difficulties/application/cqrs/queries/get-skill-difficulty.query.js';
import type { SkillDifficultyRepository } from '../../../../src/modules/skill-difficulties/application/ports/skill-difficulty-repository.port.js';
import type { SkillDifficultyGuide } from '../../../../src/modules/skill-difficulties/domain/value-objects/skill-difficulty-guide.vo.js';
import { MongoSkillDifficultyRepository } from '../../../../src/modules/skill-difficulties/infrastructure/db/mongo.skill-difficulty.repository.js';
import { ForbiddenError, NotFoundError } from '../../../../src/modules/shared/domain/errors/errors.js';

// Fixture texts, not the rulebook ones
const GENERAL: SkillDifficultyGuide = { skillId: 'general', examples: [{ difficulty: 'm', text: { en: 'average', es: 'normal' } }] };
const CLIMB: SkillDifficultyGuide = { skillId: 'e2e-climb', examples: [{ difficulty: 'h', text: { en: 'a wall' } }] };

const repository = (guides: SkillDifficultyGuide[]): SkillDifficultyRepository => ({
  findById: id => Promise.resolve(guides.find(guide => guide.skillId === id) ?? null),
  findAll: () => Promise.resolve(guides),
});

describe('GetSkillDifficultyHandler', () => {
  it('returns the guide of the skill to Core Law users and administrators', async () => {
    const handler = new GetSkillDifficultyHandler(repository([GENERAL, CLIMB]));
    await expect(handler.execute(new GetSkillDifficultyQuery('e2e-climb', 'user', ['rmu-core-law']))).resolves.toEqual(CLIMB);
    await expect(handler.execute(new GetSkillDifficultyQuery('e2e-climb', 'service', ['rmu-admin']))).resolves.toEqual(CLIMB);
  });

  it('returns the general scale as fallback for a skill without examples', async () => {
    const handler = new GetSkillDifficultyHandler(repository([GENERAL, CLIMB]));
    await expect(handler.execute(new GetSkillDifficultyQuery('disarm', 'user', ['rmu-core-law']))).resolves.toEqual({
      ...GENERAL,
      fallback: true,
    });
    await expect(handler.execute(new GetSkillDifficultyQuery('general', 'user', ['rmu-core-law']))).resolves.toEqual(GENERAL);
  });

  it('rejects users without Core Law access and answers 404 when nothing was imported', async () => {
    await expect(
      new GetSkillDifficultyHandler(repository([GENERAL])).execute(new GetSkillDifficultyQuery('general', 'user', ['rmu-user'])),
    ).rejects.toBeInstanceOf(ForbiddenError);
    await expect(
      new GetSkillDifficultyHandler(repository([])).execute(new GetSkillDifficultyQuery('climbing', 'user', ['rmu-core-law'])),
    ).rejects.toBeInstanceOf(NotFoundError);
  });
});

describe('GetSkillDifficultiesHandler', () => {
  it('lists every guide to Core Law users only', async () => {
    const handler = new GetSkillDifficultiesHandler(repository([GENERAL, CLIMB]));
    await expect(handler.execute(new GetSkillDifficultiesQuery('user', ['rmu-core-law']))).resolves.toEqual([GENERAL, CLIMB]);
    await expect(handler.execute(new GetSkillDifficultiesQuery('user', ['rmu-user']))).rejects.toBeInstanceOf(ForbiddenError);
  });
});

describe('MongoSkillDifficultyRepository.mapToGuide', () => {
  it('maps the stored document and leaves out the empty optional fields', () => {
    expect(
      MongoSkillDifficultyRepository.mapToGuide({ _id: 'adrenal-speed', sharedWith: 'adrenal-defense', examples: CLIMB.examples }),
    ).toEqual({ skillId: 'adrenal-speed', sharedWith: 'adrenal-defense', examples: CLIMB.examples });
    expect(MongoSkillDifficultyRepository.mapToGuide({ _id: 'x', context: { en: 'c' }, examples: [] })).toEqual({
      skillId: 'x',
      context: { en: 'c' },
      examples: [],
    });
  });
});
