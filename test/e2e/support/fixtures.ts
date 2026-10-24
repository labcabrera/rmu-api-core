// Valid request bodies for each resource, with the fields a test cares about passed as overrides.
type Body = Record<string, unknown>;

export const realmBody = (overrides: Body = {}): Body => ({
  name: 'E2E realm',
  magicPresence: 'limited',
  accessType: 'private',
  ...overrides,
});

const sexBased = { male: 1, female: 1 };

export const raceBody = (realmId: string, overrides: Body = {}): Body => ({
  name: 'E2E race',
  archetype: 'human',
  realmId,
  sizeId: 'medium',
  stats: { ag: 0, co: 0, em: 0, in: 0, me: 0, pr: 0, qu: 0, re: 0, sd: 0, st: 0 },
  resistances: { channeling: 0, disease: 0, essence: 0, fear: 0, mentalism: 0, physical: 0, poison: 0 },
  averageHeight: sexBased,
  averageWeight: sexBased,
  strideBonus: 0,
  enduranceBonus: 0,
  recoveryMultiplier: 1,
  baseHits: 10,
  baseDevPoints: 60,
  baseAt: 1,
  talents: [],
  traits: [],
  ...overrides,
});

export const cultureBody = (overrides: Body = {}): Body => ({
  name: 'E2E culture',
  accessType: 'private',
  skillRanks: [{ type: 'skill', skillId: 'e2e-skill', ranks: 2 }],
  ...overrides,
});

export const professionBody = (id: string, overrides: Body = {}): Body => ({
  id,
  archetype: 'non-spellcaster',
  availableRealmTypes: ['channeling'],
  fixedRealmTypes: [],
  skillCosts: { animal: [2, 4], awareness: [1, 3] },
  professionalSkills: ['e2e-skill'],
  accessType: 'private',
  ...overrides,
});

export const skillCategoryBody = (id: string, overrides: Body = {}): Body => ({
  id,
  bonus: ['ag', 'qu'],
  realmBonus: null,
  ...overrides,
});

export const skillBody = (id: string, categoryId: string, overrides: Body = {}): Body => ({
  id,
  categoryId,
  bonus: ['ag', 'qu'],
  accessType: 'private',
  ...overrides,
});

export const traitBody = (overrides: Body = {}): Body => ({
  name: 'E2E trait',
  category: 'combat',
  isTalent: true,
  specialization: 'none',
  isTierBased: false,
  adquisitionCost: 5,
  ...overrides,
});

export const enumerationBody = (overrides: Body = {}): Body => ({
  key: 'e2e-key',
  category: 'animal-type',
  accessType: 'private',
  ...overrides,
});

export const effectTypeBody = (id: string, overrides: Body = {}): Body => ({
  id,
  isPersistent: true,
  isStackable: false,
  value: 'required',
  modifier: 'optional',
  rounds: 'forbidden',
  text: 'optional',
  location: 'forbidden',
  delay: 'forbidden',
  accessType: 'private',
  ...overrides,
});

export const maneuverModifierBody = (key: string, overrides: Body = {}): Body => ({
  key,
  scope: { skillIds: ['e2e-skill'] },
  type: 'flag',
  value: 10,
  accessType: 'private',
  ...overrides,
});
