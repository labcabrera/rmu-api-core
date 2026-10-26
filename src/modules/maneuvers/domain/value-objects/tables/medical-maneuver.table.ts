import { AbsoluteManeuverTable } from '../absolute-maneuver-table.vo.js';

export const MEDICAL_MANEUVER_TABLE = new AbsoluteManeuverTable(
  'medical',
  [
    {
      min: null,
      max: 0,
      result: {
        result: 'absolute-failure',
        message:
          'The herb is not only ruined, it has become slightly toxic. If treating a patient, you manage to make things worse, increasing any injury penalty by -10.',
        messageTranslations: {
          es: 'La hierba no solo se ha echado a perder, sino que se ha vuelto ligeramente tóxica. Si estás tratando a un paciente, consigues empeorar las cosas y aumentas en -10 cualquier penalización por herida.',
        },
        effects: [
          {
            status: 'injuryPenalty',
            value: 10,
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
          'The herb or poison and your pride are ruined. If treating a patient, the Recovery Roll is made at -100 (as if they received no care).',
        messageTranslations: {
          es: 'La hierba o el veneno se echan a perder, y tu orgullo también. Si estás tratando a un paciente, la Tirada de recuperación se hace a -100 (como si no hubiera recibido cuidados).',
        },
        effects: [
          {
            status: 'recoveryRollModifier',
            value: -100,
          },
        ],
      },
    },
    {
      min: 76,
      max: 100,
      result: {
        result: 'partial-success',
        message:
          'The herb or poison is half as potent. If treating a patient, your misguided care provides minimal improvement. The Recovery Roll is made at a modifier of -25.',
        messageTranslations: {
          es: 'La hierba o el veneno tiene la mitad de potencia. Si estás tratando a un paciente, tus cuidados desacertados apenas aportan mejora. La Tirada de recuperación se hace con un modificador de -25.',
        },
        effects: [
          {
            status: 'recoveryRollModifier',
            value: -25,
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
          'The herb or poison is ready! If treating a patient, you are alert enough to catch problems as they arise and they should recover normally (+0 to the Recovery Roll).',
        messageTranslations: {
          es: '¡La hierba o el veneno está listo! Si estás tratando a un paciente, estás lo bastante atento para detectar los problemas en cuanto surgen y debería recuperarse con normalidad (+0 a la Tirada de recuperación).',
        },
      },
    },
    {
      min: 176,
      max: null,
      result: {
        result: 'absolute-success',
        message:
          'The herb or poison has doubled potency. If treating a patient, you know exactly what to do and they respond miraculously to your care (add +25 to the Recovery Roll).',
        messageTranslations: {
          es: 'La hierba o el veneno tiene el doble de potencia. Si estás tratando a un paciente, sabes exactamente qué hacer y responde milagrosamente a tus cuidados (suma +25 a la Tirada de recuperación).',
        },
        effects: [
          {
            status: 'recoveryRollModifier',
            value: 25,
          },
        ],
      },
    },
  ],
  "Your preparation of the herb or poison has altered its properties in a way that may be useful (on a Success) or not (on a Failure). If treating a patient, in addition to success or failure treating the condition, you've improved or worsened a different condition by +/-10.",
  {
    es: 'Tu preparación de la hierba o el veneno ha alterado sus propiedades de una forma que puede ser útil (con un Éxito) o no (con un Fallo). Si estás tratando a un paciente, además de tener éxito o fallar al tratar la afección, has mejorado o empeorado otra afección en +/-10.',
  },
);
