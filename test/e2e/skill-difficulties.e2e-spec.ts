import request from 'supertest';
import { type E2eApp, startApp } from './support/app.js';

describe('Skill difficulties (e2e)', () => {
  let e2e: E2eApp;

  beforeAll(async () => {
    e2e = await startApp();
  });

  afterAll(async () => {
    await e2e?.stop();
  });

  // Fixture texts, not the rulebook ones
  const seed = () =>
    e2e.connection.collection('skill-difficulties').insertMany([
      { _id: 'general', examples: [{ difficulty: 'm', text: { en: 'average', es: 'normal' } }] },
      { _id: 'e2e-climb', context: { en: 'walls' }, examples: [{ difficulty: 'h', text: { en: 'a wall' } }] },
    ] as never[]);

  it('answers 404 before the import and 403 without Core Law access', async () => {
    await request(e2e.server).get('/v1/skill-difficulties/e2e-climb').set('Authorization', e2e.auth('coreLaw')).expect(404);
    await request(e2e.server).get('/v1/skill-difficulties/e2e-climb').set('Authorization', e2e.auth('owner')).expect(403);
    await request(e2e.server).get('/v1/skill-difficulties').set('Authorization', e2e.auth('owner')).expect(403);
    await request(e2e.server).get('/v1/skill-difficulties').expect(401);
  });

  it('returns the guide of a skill, the general scale as fallback and the whole list', async () => {
    await seed();
    const own = await request(e2e.server).get('/v1/skill-difficulties/e2e-climb').set('Authorization', e2e.auth('coreLaw')).expect(200);
    expect(own.body).toEqual({
      skillId: 'e2e-climb',
      context: { en: 'walls' },
      examples: [{ difficulty: 'h', text: { en: 'a wall' } }],
      fallback: false,
    });

    const fallback = await request(e2e.server).get('/v1/skill-difficulties/disarm').set('Authorization', e2e.auth('admin')).expect(200);
    expect(fallback.body).toMatchObject({ skillId: 'general', fallback: true, examples: [{ difficulty: 'm', text: { es: 'normal' } }] });

    const list = await request(e2e.server).get('/v1/skill-difficulties').set('Authorization', e2e.auth('coreLaw')).expect(200);
    expect((list.body as { skillId: string }[]).map(guide => guide.skillId)).toEqual(['e2e-climb', 'general']);
  });
});
