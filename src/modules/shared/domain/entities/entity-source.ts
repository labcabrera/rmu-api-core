/** Where an entity comes from (spec 063): the rulebook (`system`, admin-only changes) or a user (`user`). */
export const ENTITY_SOURCES = ['system', 'user'] as const;

export type EntitySource = (typeof ENTITY_SOURCES)[number];
