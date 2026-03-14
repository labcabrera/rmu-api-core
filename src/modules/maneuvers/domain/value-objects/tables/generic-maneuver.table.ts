import { AbsoluteManeuverTable } from '../absolute-maneuver-table.vo';

export const ABSOLUTE_MANEUVER_TABLE = new AbsoluteManeuverTable(
  'generic',
  [
    {
      min: null,
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
      max: null,
      result: { result: 'absolute-success', message: 'You succeed in the best way possible, and impress everyone who sees you.' },
    },
  ],
  'There is an unexpected side effect to you maneuver determined by the GM.',
);
