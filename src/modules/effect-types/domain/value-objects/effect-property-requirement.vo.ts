export const EFFECT_PROPERTY_REQUIREMENTS = ['required', 'optional', 'forbidden'] as const;

export type EffectPropertyRequirement = (typeof EFFECT_PROPERTY_REQUIREMENTS)[number];
