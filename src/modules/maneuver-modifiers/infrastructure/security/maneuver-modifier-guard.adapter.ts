import { BaseEntityGuard } from '../../../shared/infrastructure/security/base-entity-guard.js';
import type { ManeuverModifierGuardPort } from '../../application/ports/maneuver-modifier-guard.port.js';
import { ManeuverModifier } from '../../domain/aggregates/maneuver-modifier.js';

export class ManeuverModifierGuardAdapter extends BaseEntityGuard<ManeuverModifier> implements ManeuverModifierGuardPort {}
