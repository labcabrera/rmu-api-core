import request from 'supertest';
import { type E2eApp, startApp } from './support/app.js';

// Read-only catalogs and calculation endpoints: no ownership, only authentication (and Core Law access for the
// healing tables).
describe('Catalogs and calculations (e2e)', () => {
  let e2e: E2eApp;

  beforeAll(async () => {
    e2e = await startApp();
  });

  afterAll(async () => {
    await e2e?.stop();
  });

  describe('armor types', () => {
    it('lists the armor types and finds one by id', async () => {
      const auth = e2e.auth('noRole');
      const list = await request(e2e.server).get('/v1/armor-types').set('Authorization', auth).expect(200);
      expect(list.body).toHaveLength(10);
      expect(list.body).toContainEqual({ id: 1, name: 'None' });

      const found = await request(e2e.server).get('/v1/armor-types/10').set('Authorization', auth).expect(200);
      expect(found.body).toEqual({ id: 10, name: 'Plate' });
    });

    it('answers 404 for an unknown armor type and 401 without a token', async () => {
      await request(e2e.server).get('/v1/armor-types/99').set('Authorization', e2e.auth('owner')).expect(404);
      await request(e2e.server).get('/v1/armor-types/plate').set('Authorization', e2e.auth('owner')).expect(404);
      await request(e2e.server).get('/v1/armor-types').expect(401);
      await request(e2e.server).get('/v1/armor-types/1').expect(401);
    });
  });

  describe('character sizes', () => {
    it('lists the character sizes and finds one by id', async () => {
      const auth = e2e.auth('noRole');
      const list = await request(e2e.server).get('/v1/character-sizes').set('Authorization', auth).expect(200);
      expect((list.body as { id: string }[]).map(size => size.id)).toEqual(expect.arrayContaining(['small', 'medium', 'large']));

      const found = await request(e2e.server).get('/v1/character-sizes/medium').set('Authorization', auth).expect(200);
      expect(found.body).toEqual({ id: 'medium', index: 5, name: 'Medium', hitMultiplier: 1 });
    });

    it('answers 404 for an unknown character size and 401 without a token', async () => {
      await request(e2e.server).get('/v1/character-sizes/colossal').set('Authorization', e2e.auth('owner')).expect(404);
      await request(e2e.server).get('/v1/character-sizes').expect(401);
      await request(e2e.server).get('/v1/character-sizes/medium').expect(401);
    });
  });

  describe('healing tables', () => {
    it('requires Core Law access', async () => {
      await request(e2e.server).get('/v1/healing-tables').expect(401);
      const res = await request(e2e.server).get('/v1/healing-tables').set('Authorization', e2e.auth('owner')).expect(403);
      expect(res.body).toMatchObject({ statusCode: 403, error: 'ForbiddenError' });
      await request(e2e.server).get('/v1/healing-tables').set('Authorization', e2e.auth('noRole')).expect(403);
    });

    it('answers 404 while the tables have not been imported, and returns them once they are', async () => {
      await request(e2e.server).get('/v1/healing-tables').set('Authorization', e2e.auth('coreLaw')).expect(404);
      await request(e2e.server).get('/v1/healing-tables').set('Authorization', e2e.auth('admin')).expect(404);

      // Made-up values with the shape of the import, not the rulebook tables.
      const tables = {
        recoveryDays: [{ min: null, max: 10, days: { cut: 1 } }],
        severityMultipliers: { light: 1, medium: 2, severe: 3 },
        headMultiplier: 2,
        severity: [{ severity: 'light', maxPenalty: -10, maxBleeding: 1 }],
        healingTypeModifiers: { none: 0, medicine: 1, 'medicine-absolute': 2, 'magic-or-herbs': 3, 'magic-and-herbs': 4 },
        herbalismBonus: 5,
        permanentInjury: [{ min: 1, max: null, result: 'none', fraction: 0 }],
        restHpPercentPerPeriod: 10,
        restPeriodHours: 8,
        fullRestDayMultiplier: 2,
        talentMultipliers: { 'e2e-talent': 0.5 },
      };
      await e2e.connection.collection('healing-tables').insertOne({ _id: 'core-law', ...tables } as never);

      const res = await request(e2e.server).get('/v1/healing-tables').set('Authorization', e2e.auth('coreLaw')).expect(200);
      expect(res.body).toEqual(tables);
      await request(e2e.server).get('/v1/healing-tables').set('Authorization', e2e.auth('admin')).expect(200);
      await request(e2e.server).get('/v1/healing-tables').set('Authorization', e2e.auth('owner')).expect(403);
    });
  });

  describe('maneuvers', () => {
    it('resolves a percent maneuver roll', async () => {
      const auth = e2e.auth('owner');
      const res = await request(e2e.server).get('/v1/maneuvers/percent?roll=55').set('Authorization', auth).expect(200);
      expect(res.body).toMatchObject({ percent: 50, message: 'Completed at 50%' });
      const critical = await request(e2e.server).get('/v1/maneuvers/percent?roll=-150').set('Authorization', auth).expect(200);
      expect(critical.body).toMatchObject({ percent: 0, critical: 'E' });
      await request(e2e.server).get('/v1/maneuvers/percent?roll=55').expect(401);
    });

    it('resolves an absolute maneuver roll, on the generic table by default', async () => {
      const auth = e2e.auth('owner');
      const res = await request(e2e.server).get('/v1/maneuvers/absolute?roll=50').set('Authorization', auth).expect(200);
      expect(res.body).toMatchObject({ result: 'failure' });
      expect(res.body).not.toHaveProperty('unusualEvent');

      const unusual = await request(e2e.server)
        .get('/v1/maneuvers/absolute?roll=50&table=generic&unusualEvent=true')
        .set('Authorization', auth)
        .expect(200);
      expect(unusual.body).toMatchObject({ result: 'failure' });
      expect(typeof (unusual.body as { unusualEvent?: unknown }).unusualEvent).toBe('string');

      const usual = await request(e2e.server)
        .get('/v1/maneuvers/absolute?roll=50&unusualEvent=false')
        .set('Authorization', auth)
        .expect(200);
      expect(usual.body).not.toHaveProperty('unusualEvent');

      await request(e2e.server).get('/v1/maneuvers/absolute?roll=50&table=missing').set('Authorization', auth).expect(404);
      await request(e2e.server).get('/v1/maneuvers/absolute?roll=abc').set('Authorization', auth).expect(400);
      await request(e2e.server).get('/v1/maneuvers/absolute?roll=50').expect(401);
    });

    it('lists the absolute maneuver tables, with the stored ones after the code ones', async () => {
      const auth = e2e.auth('owner');
      await e2e.connection.collection('maneuver-tables').insertOne({
        _id: 'e2e-stored',
        table: [{ min: null, max: null, result: { result: 'success', message: 'E2E stored result' } }],
      } as never);

      const names = await request(e2e.server).get('/v1/maneuvers/absolute/tables').set('Authorization', auth).expect(200);
      expect(names.body).toEqual(expect.arrayContaining(['generic', 'medical', 'e2e-stored']));
      expect((names.body as string[]).at(-1)).toBe('e2e-stored');

      const generic = await request(e2e.server).get('/v1/maneuvers/absolute/tables/generic').set('Authorization', auth).expect(200);
      expect(generic.body).toMatchObject({ name: 'generic' });
      expect((generic.body as { table: { max: number | null }[] }).table.map(row => row.max)).toContain(0);

      const stored = await request(e2e.server).get('/v1/maneuvers/absolute/tables/e2e-stored').set('Authorization', auth).expect(200);
      expect(stored.body).toMatchObject({ name: 'e2e-stored' });
      const roll = await request(e2e.server).get('/v1/maneuvers/absolute?roll=7&table=e2e-stored').set('Authorization', auth).expect(200);
      expect(roll.body).toMatchObject({ result: 'success', message: 'E2E stored result' });

      await request(e2e.server).get('/v1/maneuvers/absolute/tables/missing').set('Authorization', auth).expect(404);
      await request(e2e.server).get('/v1/maneuvers/absolute/tables').expect(401);
      await request(e2e.server).get('/v1/maneuvers/absolute/tables/generic').expect(401);
    });

    it('resolves an endurance maneuver roll', async () => {
      const auth = e2e.auth('owner');
      const res = await request(e2e.server).get('/v1/maneuvers/endurance?roll=120').set('Authorization', auth).expect(200);
      expect(res.body).toMatchObject({ result: 'success', fatigue: 0, hitPoints: 0, bonus: 0 });
      const failure = await request(e2e.server).get('/v1/maneuvers/endurance?roll=-5').set('Authorization', auth).expect(200);
      expect(failure.body).toMatchObject({ result: 'absolute-failure', fatigue: 20, hitPoints: 10 });
      const unusual = await request(e2e.server)
        .get('/v1/maneuvers/endurance?roll=120&unusualEvent=true')
        .set('Authorization', auth)
        .expect(200);
      expect((unusual.body as { message: string }).message.length).toBeGreaterThan((res.body as { message: string }).message.length);
      await request(e2e.server).get('/v1/maneuvers/endurance?roll=120').expect(401);
    });
  });

  describe('resistance rolls', () => {
    it('resolves a resistance roll with its modifiers', async () => {
      const res = await request(e2e.server)
        .post('/v1/resistance-rolls')
        .set('Authorization', e2e.auth('owner'))
        .send({ attackLevel: 5, targetLevel: 3, roll: 40, modifiers: [{ key: 'e2e-bonus', value: 6 }] })
        .expect(201);
      expect(res.body).toEqual({
        result: 'mild-failure',
        modifiers: [
          { key: 'e2e-bonus', value: 6 },
          { key: 'attack-level', value: -10 },
          { key: 'target-level', value: 6 },
          { key: 'roll', value: 40 },
        ],
        totalRoll: 42,
        failure: 8,
      });

      const success = await request(e2e.server)
        .post('/v1/resistance-rolls')
        .set('Authorization', e2e.auth('owner'))
        .send({ attackLevel: 1, targetLevel: 1, roll: 90 })
        .expect(201);
      expect(success.body).toMatchObject({ result: 'success', totalRoll: 90, failure: 0 });
    });

    it('rejects an empty body, a text level and a request without a token', async () => {
      const auth = e2e.auth('owner');
      const res = await request(e2e.server).post('/v1/resistance-rolls').set('Authorization', auth).send({}).expect(400);
      expect(res.body).toMatchObject({ statusCode: 400, error: 'BadRequestException', path: '/v1/resistance-rolls' });
      expect((res.body as { message: unknown }).message).toEqual(expect.arrayContaining([expect.any(String)]));
      await request(e2e.server)
        .post('/v1/resistance-rolls')
        .set('Authorization', auth)
        .send({ attackLevel: 'high', targetLevel: 1, roll: 50 })
        .expect(400);
      await request(e2e.server).post('/v1/resistance-rolls').send({ attackLevel: 1, targetLevel: 1, roll: 50 }).expect(401);
    });
  });
});
