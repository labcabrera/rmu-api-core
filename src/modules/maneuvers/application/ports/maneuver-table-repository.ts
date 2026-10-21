import { AbsoluteManeuverTable } from '../../domain/value-objects/absolute-maneuver-table.vo';

/** Absolute maneuver tables stored in the database (collection maneuver-tables). */
export interface ManeuverTableRepository {
  findByName(name: string): Promise<AbsoluteManeuverTable | null>;

  findNames(): Promise<string[]>;
}
