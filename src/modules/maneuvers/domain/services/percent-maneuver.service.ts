import { PercentManeuverResult } from '../value-objects/percent-maneuver-result.vo';

const percentTable: { min: number; max: number; result: PercentManeuverResult }[] = [
  { min: -Infinity, max: -100, result: { percent: 0, critical: 'E', message: 'Received critical E' } },
  { min: -99, max: -80, result: { percent: 0, critical: 'D', message: 'Received critical D' } },
  { min: -79, max: -60, result: { percent: 0, critical: 'C', message: 'Received critical C' } },
  { min: -59, max: -40, result: { percent: 0, critical: 'B', message: 'Received critical B' } },
  { min: -39, max: -20, result: { percent: 0, critical: 'A', message: 'Received critical A' } },
  { min: -19, max: 0, result: { percent: 0, critical: undefined, message: 'Fail to act' } },
  { min: 1, max: 10, result: { percent: 5, critical: undefined, message: 'Completed at 5%' } },
  { min: 11, max: 20, result: { percent: 10, critical: undefined, message: 'Completed at 10%' } },
  { min: 21, max: 30, result: { percent: 20, critical: undefined, message: 'Completed at 20%' } },
  { min: 31, max: 40, result: { percent: 30, critical: undefined, message: 'Completed at 30%' } },
  { min: 41, max: 50, result: { percent: 40, critical: undefined, message: 'Completed at 40%' } },
  { min: 51, max: 60, result: { percent: 50, critical: undefined, message: 'Completed at 50%' } },
  { min: 61, max: 70, result: { percent: 60, critical: undefined, message: 'Completed at 60%' } },
  { min: 71, max: 80, result: { percent: 70, critical: undefined, message: 'Completed at 70%' } },
  { min: 81, max: 90, result: { percent: 80, critical: undefined, message: 'Completed at 80%' } },
  { min: 91, max: 100, result: { percent: 90, critical: undefined, message: 'Completed at 90%' } },
  { min: 101, max: 130, result: { percent: 100, critical: undefined, message: 'Completed at 100%' } },
  { min: 131, max: 160, result: { percent: 110, critical: undefined, message: 'Completed at 110%' } },
  { min: 161, max: 190, result: { percent: 120, critical: undefined, message: 'Completed at 120%' } },
  { min: 191, max: 220, result: { percent: 130, critical: undefined, message: 'Completed at 130%' } },
  { min: 221, max: 250, result: { percent: 140, critical: undefined, message: 'Completed at 140%' } },
  { min: 251, max: 280, result: { percent: 150, critical: undefined, message: 'Completed at 150%' } },
  { min: 281, max: Infinity, result: { percent: 150, critical: undefined, message: 'Exceptional' } },
];

export class PercentManeuverService {
  execute(roll: number): PercentManeuverResult {
    const entry = percentTable.find((row) => roll >= row.min && roll <= row.max);
    if (!entry) {
      throw new Error('Roll out of bounds');
    }
    return entry.result;
  }
}
