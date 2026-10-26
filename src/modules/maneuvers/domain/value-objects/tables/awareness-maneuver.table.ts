import { AbsoluteManeuverTable } from '../absolute-maneuver-table.vo.js';

export const AWARENESS_MANEUVER_TABLE = new AbsoluteManeuverTable(
  'awareness',
  [
    {
      min: null,
      max: 0,
      result: {
        result: 'absolute-failure',
        message:
          'You glean enormous amounts of information about your target… all of it wrong. You utterly misinterpret what you perceive and are sure that you are correct.',
        messageTranslations: {
          es: 'Obtienes muchísima información sobre tu objetivo… toda errónea. Malinterpretas por completo lo que percibes y estás seguro de tener razón.',
        },
      },
    },
    {
      min: 1,
      max: 75,
      result: {
        result: 'failure',
        message:
          'Attempting to emulate the perceptive abilities of an eggplant, you notice nothing useful. There is a great future waiting for you as an art critic.',
        messageTranslations: {
          es: 'Emulando la capacidad de percepción de una berenjena, no notas nada útil. Te espera un gran futuro como crítico de arte.',
        },
      },
    },
    {
      min: 76,
      max: 100,
      result: {
        result: 'partial-success',
        message: 'Your interest is piqued, but you glean minimal information. You may try again in 6 rounds at a +10, if appropriate.',
        messageTranslations: {
          es: 'Algo despierta tu interés, pero obtienes muy poca información. Puedes volver a intentarlo dentro de 6 asaltos con +10, si procede.',
        },
        effects: [
          {
            status: 'retryBonus',
            value: 10,
            roundDelay: 6,
          },
        ],
      },
    },
    {
      min: 101,
      max: 175,
      result: {
        result: 'success',
        message: 'Following your instincts you focus your attention, allowing your finely-tuned perception to reveal that which you seek.',
        messageTranslations: { es: 'Siguiendo tu instinto, centras tu atención y tu aguda percepción te revela lo que buscas.' },
      },
    },
    {
      min: 176,
      max: null,
      result: {
        result: 'absolute-success',
        message:
          'Elementary my dear boy! You identify with casual ease the target or information you seek, along with contextual information not obvious to a lesser eye.',
        messageTranslations: {
          es: '¡Elemental, querido amigo! Identificas con total facilidad el objetivo o la información que buscas, junto con detalles de contexto que pasarían desapercibidos a un ojo menos experto.',
        },
      },
    },
  ],
  'Your surroundings trigger a flashback to your past and consumes your attention for 3 rounds while you relive the experience. You may immediately make a Lore maneuver to recall something previously missed but important to the story. Your maneuver resolves after.',
  {
    es: 'Tu entorno te provoca un recuerdo del pasado que acapara tu atención durante 3 asaltos mientras revives la experiencia. Puedes hacer de inmediato una maniobra de Lore para recordar algo que antes pasaste por alto pero que es importante para la historia. Tu maniobra se resuelve después.',
  },
);
