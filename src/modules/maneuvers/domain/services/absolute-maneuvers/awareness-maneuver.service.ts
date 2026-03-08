import { AbsoluteManeuverResult } from '../../value-objects/absolute-maneuver-result.vo';
import { ManeuverService } from './maneuver-service';

const AWARENESS_PERCENT_TABLE: { min: number; max: number; result: AbsoluteManeuverResult }[] = [
  {
    min: -Infinity,
    max: 0,
    result: {
      result: 'absolute-failure',
      message:
        'You glean enormous amounts of information about your target… all of it wrong. You utterly misinterpret what you perceive and are sure that you are correct.',
    },
  },
  {
    min: 1,
    max: 75,
    result: {
      result: 'failure',
      message:
        'Attempting to emulate the perceptive abilities of an eggplant, you notice nothing useful. There is a great future waiting for you as an art critic.',
    },
  },
  {
    min: 76,
    max: 100,
    result: {
      result: 'partial-success',
      message: 'Your interest is piqued, but you glean minimal information. You may try again in 6 rounds at a +10, if appropriate.',
    },
  },
  {
    min: 101,
    max: 175,
    result: {
      result: 'success',
      message: 'Following your instincts you focus your attention, allowing your finely-tuned perception to reveal that which you seek.',
    },
  },
  {
    min: 176,
    max: Infinity,
    result: {
      result: 'absolute-success',
      message:
        'Elementary my dear boy! You identify with casual ease the target or information you seek, along with contextual information not obvious to a lesser eye.',
    },
  },
];

export class AwarenessManeuverService implements ManeuverService {
  execute(roll: number, unusualEvent: boolean): AbsoluteManeuverResult {
    const entry = AWARENESS_PERCENT_TABLE.find((row) => roll >= row.min && roll <= row.max);
    if (!entry) {
      throw new Error('Roll out of bounds');
    }
    return {
      ...entry.result,
      message: unusualEvent
        ? entry.result.message +
          ' Your surroundings trigger a flashback to your past and consumes your attention for 3 rounds while you relive the experience. You may immediately make a Lore maneuver to recall something previously missed but important to the story. Your maneuver resolves after.'
        : entry.result.message,
    };
  }
}
