import { AbsoluteManeuverResult } from '../../value-objects/absolute-maneuver-result.vo';

const PERCENT_TABLE: { min: number; max: number; result: AbsoluteManeuverResult }[] = [
  {
    min: -Infinity,
    max: 0,
    result: {
      result: 'absolute-failure',
      message: 'Not only do you utterly fail, but you manage to make the situation worse. You are an embarrassment to yourself.',
    },
  },
  {
    min: 1,
    max: 75,
    result: {
      result: 'failure',
      message: "You fail the maneuver and must pay the consequences. Hopefully this wasn't a life or death situation.",
    },
  },
  {
    min: 76,
    max: 100,
    result: {
      result: 'partial-success',
      message: 'If this maneuver is something you can partially succeed at then you do so. Otherwise the maneuver fails. Too bad.',
    },
  },
  {
    min: 101,
    max: 175,
    result: {
      result: 'success',
      message: 'The attempt succeeds and you pat yourself on the back for a job well done. Congratulations!',
    },
  },
  {
    min: 176,
    max: Infinity,
    result: { result: 'absolute-success', message: 'You succeed in the best way possible, and impress everyone who sees you.' },
  },
];

export class AbsoluteManeuverService {
  execute(roll: number, unusualEvent: boolean): AbsoluteManeuverResult {
    const entry = PERCENT_TABLE.find((row) => roll >= row.min && roll <= row.max);
    if (!entry) {
      throw new Error('Roll out of bounds');
    }
    return {
      ...entry.result,
      message: unusualEvent
        ? entry.result.message + ' There is an unexpected side effect to you maneuver determined by the GM.'
        : entry.result.message,
    };
  }
}
