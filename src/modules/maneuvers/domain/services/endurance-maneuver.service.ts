import type { EnduranceManeuverResult } from '../value-objects/endurance-maneuver-result.vo.js';

const UNUSUAL_EVENT =
  'While fighting off exhaustion you have a brief hallucination that gives you insight into a problem you have been having. You may, in the next 24 hours, reroll a previously failed Lore, Science, or Delving roll in order to achive your goal.';
const UNUSUAL_EVENT_ES =
  'Mientras combates el agotamiento tienes una breve alucinación que te aporta una nueva perspectiva sobre un problema que venías arrastrando. En las próximas 24 horas puedes repetir una tirada de Lore, Ciencia o Erudición que hayas fallado antes para lograr tu objetivo.';

const ENDURANCE_TABLE: { min: number; max: number; result: EnduranceManeuverResult }[] = [
  {
    min: -Infinity,
    max: 0,
    result: {
      result: 'absolute-failure',
      message:
        'You feel a weakness wash you over you. When is it going to be time for bed? Increase your current fatigue penalty by 20 and suffer 10 hits.',
      messageTranslations: {
        es: 'Te invade una oleada de debilidad. ¿Cuándo va a ser hora de irse a la cama? Aumenta en 20 tu penalización actual por fatiga y recibes 10 PV de daño.',
      },
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
      messageTranslations: {
        es: '¿Por qué va todo el mundo tan deprisa? ¿A qué viene tanta prisa? Solo necesitas una siestecita. Solo unos minutos…. ¿por favor? Aumenta en 10 tu penalización por fatiga.',
      },
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
      messageTranslations: {
        es: 'Es un trabajo duro y cada esfuerzo te mina las fuerzas. Pero seguro que eres lo bastante fuerte para seguir adelante. Aumenta en 5 tu penalización por fatiga.',
      },
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
      messageTranslations: {
        es: 'Entre la emoción y tu fortaleza, te sacudes el agotamiento y estás preparado para lo que venga. No acumulas fatiga adicional.',
      },
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
      messageTranslations: {
        es: 'Es hora de correr un maratón. Encuentras consuelo en tu tarea y te sientes con más energía que nunca para afrontar lo que tienes por delante. Reduce en 10 cualquier penalización actual por fatiga y obtienes +5 a la acción que vayas a realizar.',
      },
      fatigue: -10,
      hitPoints: 0,
      bonus: 5,
    },
  },
];

export class EnduranceManeuverService {
  execute(roll: number, unusualEvent: boolean): EnduranceManeuverResult {
    const entry = ENDURANCE_TABLE.find(row => roll >= row.min && roll <= row.max);
    if (!entry) {
      throw new Error('Roll out of bounds');
    }
    return {
      ...entry.result,
      message: unusualEvent ? `${entry.result.message} ${UNUSUAL_EVENT}` : entry.result.message,
      messageTranslations: unusualEvent
        ? { es: `${entry.result.messageTranslations?.es ?? entry.result.message} ${UNUSUAL_EVENT_ES}` }
        : entry.result.messageTranslations,
    };
  }
}
