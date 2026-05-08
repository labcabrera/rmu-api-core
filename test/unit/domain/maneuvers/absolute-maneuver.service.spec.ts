import { ValidationError } from 'src/modules/shared/domain/errors/errors';
import { AbsoluteManeuverService } from 'src/modules/maneuvers/domain/services/absolute-maneuver.service';

describe('AbsoluteManeuverService', () => {
  const service = new AbsoluteManeuverService();

  it('uses the generic table by default and resolves all boundary result bands', () => {
    expect(service.execute(-100, false)).toMatchObject({ result: 'absolute-failure' });
    expect(service.execute(0, false)).toMatchObject({ result: 'absolute-failure' });
    expect(service.execute(1, false)).toMatchObject({ result: 'failure' });
    expect(service.execute(75, false)).toMatchObject({ result: 'failure' });
    expect(service.execute(76, false)).toMatchObject({ result: 'partial-success' });
    expect(service.execute(100, false)).toMatchObject({ result: 'partial-success' });
    expect(service.execute(101, false)).toMatchObject({ result: 'success' });
    expect(service.execute(175, false)).toMatchObject({ result: 'success' });
    expect(service.execute(176, false)).toMatchObject({ result: 'absolute-success' });
    expect(service.execute(999, false)).toMatchObject({ result: 'absolute-success' });
  });

  it('appends the selected table unusual event text only when requested', () => {
    const normalResult = service.execute(101, false, 'adrenal');
    const unusualResult = service.execute(101, true, 'adrenal');

    expect(normalResult.message).not.toContain('unfamiliar darkness');
    expect(unusualResult.message).toContain(normalResult.message);
    expect(unusualResult.message).toContain('unfamiliar darkness');
  });

  it('returns table-specific effects without stripping their metadata', () => {
    expect(service.execute(0, false, 'adrenal').effects).toEqual([{ status: 'penaltyUntilAbsoluteSuccess', value: -25 }]);
    expect(service.execute(76, false, 'awareness').effects).toEqual([{ status: 'retryBonus', value: 10, roundDelay: 6 }]);
    expect(service.execute(176, false, 'medical').effects).toEqual([{ status: 'recoveryRollModifier', value: 25 }]);
  });

  it('exposes the available absolute maneuver table names', () => {
    expect(service.getTableNames()).toEqual([
      'generic',
      'adrenal',
      'animal',
      'awareness',
      'composition',
      'crafting',
      'gymnastic',
      'lore',
      'medical',
    ]);
  });

  it('rejects unknown table names', () => {
    expect(() => service.execute(100, false, 'unknown')).toThrow(ValidationError);
    expect(() => service.execute(100, false, 'unknown')).toThrow('Invalid absolute maneuver table');
  });
});
