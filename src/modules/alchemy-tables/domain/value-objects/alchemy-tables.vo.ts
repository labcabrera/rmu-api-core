/** The alchemical failure tables (Treasure Law 7.3, spec 064): the SCR failure of each kind of enchantment. */
export const ALCHEMY_FAILURE_TABLES = [
  'bonus',
  'embedded-entity',
  'general',
  'independent-entity',
  'intelligence',
  'location',
  'organism',
  'potion',
  'power-enhancer',
  'spell-power',
] as const;
export type AlchemyFailureTable = (typeof ALCHEMY_FAILURE_TABLES)[number];

/** Power levels of an enchanted item: each one multiplies the cost of its market value. */
export const POWER_LEVELS = ['average', 'superior', 'heroic', 'legendary', 'epic'] as const;
export type PowerLevel = (typeof POWER_LEVELS)[number];

/** A serendipity result of a failure table: a minor or a major lucky outcome. */
export const SERENDIPITY_KINDS = ['minor', 'major'] as const;
export type Serendipity = (typeof SERENDIPITY_KINDS)[number];

/** One row of a failure table: the text for a range of the failure roll. */
export interface AlchemyFailureRow {
  min: number;
  /** Null: no upper limit (an open row such as "301+") */
  max: number | null;
  text: string;
  serendipity?: Serendipity;
}

/** Id of the only document of the alchemy-tables collection. */
export const ALCHEMY_TABLES_ID = 'alchemy';

/**
 * Tables of alchemy (workspace spec 064): the ten failure tables and the multipliers of the power levels. The values
 * come from the rulebook and are imported from the gitignored data directory (data/treasure-law/alchemy-tables.json),
 * never written in code.
 */
export interface AlchemyTables {
  id: typeof ALCHEMY_TABLES_ID;
  /** Rows sorted by min */
  failureTables: Record<AlchemyFailureTable, AlchemyFailureRow[]>;
  powerLevels: Record<PowerLevel, number>;
  /** Bumped by the import when the tables change; 0 when the document has none */
  version: number;
}
