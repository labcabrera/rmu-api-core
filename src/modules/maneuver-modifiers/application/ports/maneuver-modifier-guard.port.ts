import type { EntityGuard } from '../../../shared/application/ports/entity-guard.js';
import { ManeuverModifier } from '../../domain/aggregates/maneuver-modifier.js';

export type ManeuverModifierGuardPort = EntityGuard<ManeuverModifier>;
