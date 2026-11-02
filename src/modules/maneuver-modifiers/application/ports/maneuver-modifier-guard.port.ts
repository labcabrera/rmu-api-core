import type { EntityGuard } from '../../../shared/application/ports/entity-guard.port.js';
import { ManeuverModifier } from '../../domain/aggregates/maneuver-modifier.js';

export const MANEUVER_MODIFIER_GUARD = Symbol('ManeuverModifierGuardPort');

export type ManeuverModifierGuardPort = EntityGuard<ManeuverModifier>;
