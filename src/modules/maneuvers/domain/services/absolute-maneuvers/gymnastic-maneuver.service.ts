import { AbsoluteManeuverResult } from '../../value-objects/absolute-maneuver-result.vo';
import { ManeuverService } from './maneuver-service';

const GYMNASTIC_PERCENT_TABLE: { min: number; max: number; result: AbsoluteManeuverResult }[] = [
  {
    min: -Infinity,
    max: 0,
    result: {
      result: 'absolute-failure',
      message:
        'In your zeal, you have forgotten to warm up and severely pull a major muscle (-25) and are stunned for two rounds. Good job buddy!',
      effects: [
        {
          status: 'stunned',
          rounds: 2,
        },
      ],
    },
  },
  {
    min: 1,
    max: 75,
    result: {
      result: 'failure',
      message:
        'You freeze at a critical moment, failing your maneuver. If appropriate, you may make an additional roll to abort your maneuver. Otherwise, take your chances.',
    },
  },
  {
    min: 76,
    max: 100,
    result: {
      result: 'partial-success',
      message:
        'Everything was going so well, but you cannot seem to follow through, and it takes longer. If appropriate make an additional maneuver at +10. Otherwise you fail.',
      effects: [
        {
          status: 'retryBonus',
          rounds: 10,
        },
      ],
    },
  },
  {
    min: 101,
    max: 175,
    result: {
      result: 'success',
      message:
        'Fancy footwork, my friend! You complete the maneuver completely as expected and in fine form, and barely break a sweat. Must be the shoes.',
    },
  },
  {
    min: 176,
    max: Infinity,
    result: {
      result: 'absolute-success',
      message:
        "You skip a light fandango, turn cartwheels 'cross the floor and complete the maneuver with the kind of precision and grace you have always dreamed about. Onlookers gawk as you make the impossible look easy.",
    },
  },
];

export class GymnasticManeuverService implements ManeuverService {
  execute(roll: number, unusualEvent: boolean): AbsoluteManeuverResult {
    const entry = GYMNASTIC_PERCENT_TABLE.find((row) => roll >= row.min && roll <= row.max);
    if (!entry) {
      throw new Error('Roll out of bounds');
    }
    return {
      ...entry.result,
      message: unusualEvent
        ? entry.result.message +
          " Regardless of if you succeed or fail, you manage to make yourself look completely foolish. If no one was watching, you're lucky. Otherwise you will never hear the end of the jokes and stories about it. Surely there's some way to make up for it, or make everyone forget..."
        : entry.result.message,
    };
  }
}
