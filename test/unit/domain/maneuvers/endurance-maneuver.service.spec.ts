import { EnduranceManeuverService } from 'src/modules/maneuvers/domain/services/endurance-maneuver.service';

describe('EnduranceManeuverService', () => {
  const service = new EnduranceManeuverService();

  it('resolves fatigue, hits, and bonus on each boundary band', () => {
    expect(service.execute(0, false)).toMatchObject({
      result: 'absolute-failure',
      fatigue: 20,
      hitPoints: 10,
      bonus: 0,
    });
    expect(service.execute(75, false)).toMatchObject({ result: 'failure', fatigue: 10 });
    expect(service.execute(76, false)).toMatchObject({ result: 'partial-success', fatigue: 5 });
    expect(service.execute(101, false)).toMatchObject({ result: 'success', fatigue: 0 });
    expect(service.execute(176, false)).toMatchObject({
      result: 'absolute-success',
      fatigue: -10,
      hitPoints: 0,
      bonus: 5,
    });
  });

  it('handles unbounded low and high rolls', () => {
    expect(service.execute(-1000, false).result).toBe('absolute-failure');
    expect(service.execute(1000, false).result).toBe('absolute-success');
  });

  it('adds the unusual event reroll guidance when requested', () => {
    const normalResult = service.execute(101, false);
    const unusualResult = service.execute(101, true);

    expect(normalResult.message).not.toContain('reroll a previously failed Lore');
    expect(unusualResult.message).toContain(normalResult.message);
    expect(unusualResult.message).toContain('reroll a previously failed Lore');
  });
});
