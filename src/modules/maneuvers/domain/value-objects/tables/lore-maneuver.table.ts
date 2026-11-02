import { AbsoluteManeuverTable } from '../absolute-maneuver-table.vo.js';

export const LORE_MANEUVER_TABLE = new AbsoluteManeuverTable(
  'lore',
  [
    {
      min: null,
      max: 0,
      result: {
        result: 'absolute-failure',
        message:
          "What's all this? You irretrievably confuse yourself and cannot possibly recall this information without at least 12 hours to refamiliarize yourself with the topic.",
        messageTranslations: {
          es: '¿Qué es todo esto? Te confundes sin remedio y no puedes recordar esta información sin al menos 12 horas para volver a familiarizarte con el tema.',
        },
      },
    },
    {
      min: 1,
      max: 75,
      result: {
        result: 'failure',
        message: 'Hmmm. Nope. Nothing springs to mind. Perhaps if you were to spend another six hours studying the matter…',
        messageTranslations: { es: 'Mmm. No. No se te ocurre nada. Quizá si pasaras otras seis horas estudiando el asunto…' },
      },
    },
    {
      min: 76,
      max: 100,
      result: {
        result: 'partial-success',
        message:
          'You recall some details of the subject, but nothing specific. Stew on this for an hour or so and something might come to you. (roll again in 1 hour).',
        messageTranslations: {
          es: 'Recuerdas algunos detalles del tema, pero nada concreto. Dale vueltas durante una hora o así y quizá te venga algo. (vuelve a tirar dentro de 1 hora).',
        },
      },
    },
    {
      min: 101,
      max: 175,
      result: {
        result: 'success',
        message:
          'Ah, of course! A simple fact, of course, right on the tip of your tongue. You recall all relevant details about the subject.',
        messageTranslations: {
          es: '¡Ah, claro! Un dato sencillo, claro, lo tenías en la punta de la lengua. Recuerdas todos los detalles relevantes sobre el tema.',
        },
      },
    },
    {
      min: 176,
      max: null,
      result: {
        result: 'absolute-success',
        message:
          "With a nonchalant air, you relate the details of the topic from memory, including relevant quotations and analysis by authorities of note. Now who's the savant around here?",
        messageTranslations: {
          es: 'Con aire despreocupado, relatas de memoria los detalles del tema, incluidas citas pertinentes y análisis de autoridades reconocidas. ¿Quién es ahora el sabio por aquí?',
        },
      },
    },
  ],
  "Great Horny Toads! You've been using that word for years and suddenly realized you were pronouncing it completely wrong! You whoop and gurgle happily, rolling your mouth around the new sound…why is everyone staring at you?",
  {
    es: '¡Por todos los sapos cornudos! Llevas años usando esa palabra y de repente te das cuenta de que la pronunciabas completamente mal. Gritas y gorjeas de alegría, paladeando el nuevo sonido… ¿por qué te mira todo el mundo?',
  },
);
