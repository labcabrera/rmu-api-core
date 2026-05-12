import { describe, expect, it } from '@jest/globals';
import { PercentManeuverService } from 'src/modules/maneuvers/domain/services/percent-maneuver.service';

describe('PercentManeuverService', () => {
  const service = new PercentManeuverService();

  it('resolves critical failure severities at negative thresholds', () => {
    expect(service.execute(-1000)).toEqual({ percent: 0, critical: 'E', message: 'Received critical E' });
    expect(service.execute(-100)).toEqual({ percent: 0, critical: 'E', message: 'Received critical E' });
    expect(service.execute(-99)).toEqual({ percent: 0, critical: 'D', message: 'Received critical D' });
    expect(service.execute(-80)).toEqual({ percent: 0, critical: 'D', message: 'Received critical D' });
    expect(service.execute(-79)).toEqual({ percent: 0, critical: 'C', message: 'Received critical C' });
    expect(service.execute(-60)).toEqual({ percent: 0, critical: 'C', message: 'Received critical C' });
    expect(service.execute(-59)).toEqual({ percent: 0, critical: 'B', message: 'Received critical B' });
    expect(service.execute(-40)).toEqual({ percent: 0, critical: 'B', message: 'Received critical B' });
    expect(service.execute(-39)).toEqual({ percent: 0, critical: 'A', message: 'Received critical A' });
    expect(service.execute(-20)).toEqual({ percent: 0, critical: 'A', message: 'Received critical A' });
  });

  it('returns zero progress without a critical from -19 through 0', () => {
    expect(service.execute(-19)).toEqual({ percent: 0, critical: undefined, message: 'Fail to act' });
    expect(service.execute(0)).toEqual({ percent: 0, critical: undefined, message: 'Fail to act' });
  });

  it('maps positive rolls to completion percentages at boundary values', () => {
    expect(service.execute(1)).toMatchObject({ percent: 5 });
    expect(service.execute(10)).toMatchObject({ percent: 5 });
    expect(service.execute(11)).toMatchObject({ percent: 10 });
    expect(service.execute(100)).toMatchObject({ percent: 90 });
    expect(service.execute(101)).toMatchObject({ percent: 100 });
    expect(service.execute(130)).toMatchObject({ percent: 100 });
    expect(service.execute(131)).toMatchObject({ percent: 110 });
    expect(service.execute(160)).toMatchObject({ percent: 110 });
    expect(service.execute(161)).toMatchObject({ percent: 120 });
    expect(service.execute(190)).toMatchObject({ percent: 120 });
    expect(service.execute(191)).toMatchObject({ percent: 130 });
    expect(service.execute(220)).toMatchObject({ percent: 130 });
    expect(service.execute(221)).toMatchObject({ percent: 140 });
    expect(service.execute(250)).toMatchObject({ percent: 140 });
    expect(service.execute(251)).toMatchObject({ percent: 150, message: 'Completed at 150%' });
    expect(service.execute(280)).toMatchObject({ percent: 150, message: 'Completed at 150%' });
    expect(service.execute(281)).toMatchObject({ percent: 150, message: 'Exceptional' });
    expect(service.execute(1000)).toMatchObject({ percent: 150, message: 'Exceptional' });
  });
});
