import { BaseEntityGuard } from '../../../shared/infrastructure/security/base-entity-guard';
import { ManeuverModifierGuardPort } from '../../application/ports/maneuver-modifier-guard.port';
import { ManeuverModifier } from '../../domain/aggregates/maneuver-modifier';

export class ManeuverModifierGuardAdapter extends BaseEntityGuard<ManeuverModifier> implements ManeuverModifierGuardPort {}
