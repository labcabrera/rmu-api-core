import { EnduranceManeuverResult } from '../value-objects/endurance-maneuver-result.vo';

const enduranceTable: { min: number; max: number; result: EnduranceManeuverResult }[] = [
  {
    min: -Infinity,
    max: 0,
    result: {
      result: 'absolute-failure',
      message:
        'You feel a weakness wash you over you. When is it going to be time for bed? Increase your current fatigue penalty by 20 and suffer 10 hits.',
      fatigue: 20,
      hitPoints: 10,
      bonus: 0,
    },
  },
  {
    min: 1,
    max: 75,
    result: {
      result: 'failure',
      message:
        "Why is everyone moving so fast? What's the rush, you just need a short nap. Just a few minutes…. please? Increase your fatigue penalty by 10.",
      fatigue: 10,
      hitPoints: 0,
      bonus: 0,
    },
  },
  {
    min: 76,
    max: 100,
    result: {
      result: 'partial-success',
      message:
        "It's hard work, and every bit saps your just strength. But surely you are strong enough to push on ahead. Increase fatigue penalty by 5.",
      fatigue: 5,
      hitPoints: 0,
      bonus: 0,
    },
  },
  {
    min: 101,
    max: 175,
    result: {
      result: 'success',
      message:
        'Between the excitement and your fortitude, you shrug off the exhaustion and are ready for whatever is coming next. You accumulate no additional fatigue.',
      fatigue: 0,
      hitPoints: 0,
      bonus: 0,
    },
  },
  {
    min: 176,
    max: Infinity,
    result: {
      result: 'absolute-success',
      message:
        "It's time for a marathon. You take solace in your task and feel more energized than ever to tackle what lies before you. Reduce any current fatigue penalty by 10, and gain a +5 to whatever action you are about to perform.",
      fatigue: -10,
      hitPoints: 0,
      bonus: 5,
    },
  },
];

export class EnduranceManeuverService {
  execute(roll: number, unusualEvent: boolean): EnduranceManeuverResult {
    const entry = enduranceTable.find((row) => roll >= row.min && roll <= row.max);
    if (!entry) {
      throw new Error('Roll out of bounds');
    }
    return {
      ...entry.result,
      message: unusualEvent
        ? entry.result.message +
          ' While fighting off exhaustion you have a brief hallucination that gives you insight into a problem you have been having. You may, in the next 24 hours, reroll a previously failed Lore, Science, or Delving roll in order to achive your goal.'
        : entry.result.message,
    };
  }
}
