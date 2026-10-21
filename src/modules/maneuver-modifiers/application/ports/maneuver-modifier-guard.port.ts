import { EntityGuard } from '../../../shared/application/ports/entity-guard';
import { ManeuverModifier } from '../../domain/aggregates/maneuver-modifier';

export type ManeuverModifierGuardPort = EntityGuard<ManeuverModifier>;
