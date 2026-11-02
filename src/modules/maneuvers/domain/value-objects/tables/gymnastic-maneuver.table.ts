import { AbsoluteManeuverTable } from '../absolute-maneuver-table.vo.js';

export const GYMNASTIC_MANEUVER_TABLE = new AbsoluteManeuverTable(
  'gymnastic',
  [
    {
      min: null,
      max: 0,
      result: {
        result: 'absolute-failure',
        message:
          'In your zeal, you have forgotten to warm up and severely pull a major muscle (-25) and are stunned for two rounds. Good job buddy!',
        messageTranslations: {
          es: 'Con tanto entusiasmo, has olvidado calentar: te das un fuerte tirón en un músculo importante (-25) y quedas aturdido durante dos asaltos. ¡Buen trabajo, colega!',
        },
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
        messageTranslations: {
          es: 'Te bloqueas en un momento crítico y fallas la maniobra. Si procede, puedes hacer una tirada adicional para abortar la maniobra. Si no, arriésgate.',
        },
      },
    },
    {
      min: 76,
      max: 100,
      result: {
        result: 'partial-success',
        message:
          'Everything was going so well, but you cannot seem to follow through, and it takes longer. If appropriate make an additional maneuver at +10. Otherwise you fail.',
        messageTranslations: {
          es: 'Todo iba muy bien, pero no consigues rematarlo y te lleva más tiempo. Si procede, haz una maniobra adicional con +10. Si no, fallas.',
        },
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
        messageTranslations: {
          es: '¡Menudo juego de pies, amigo! Completas la maniobra tal y como esperabas, con estilo y casi sin sudar. Deben de ser los zapatos.',
        },
      },
    },
    {
      min: null,
      max: Infinity,
      result: {
        result: 'absolute-success',
        message:
          "You skip a light fandango, turn cartwheels 'cross the floor and complete the maneuver with the kind of precision and grace you have always dreamed about. Onlookers gawk as you make the impossible look easy.",
        messageTranslations: {
          es: 'Te marcas un ligero fandango, das volteretas por el suelo y completas la maniobra con la precisión y la elegancia con las que siempre has soñado. Los presentes se quedan boquiabiertos mientras haces que lo imposible parezca fácil.',
        },
      },
    },
  ],
  "Regardless of if you succeed or fail, you manage to make yourself look completely foolish. If no one was watching, you're lucky. Otherwise you will never hear the end of the jokes and stories about it. Surely there's some way to make up for it, or make everyone forget...",
  {
    es: 'Tengas éxito o falles, consigues quedar completamente en ridículo. Si nadie te estaba mirando, tienes suerte. Si no, nunca dejarás de oír chistes e historias sobre ello. Seguro que hay alguna forma de compensarlo, o de hacer que todos lo olviden...',
  },
);
