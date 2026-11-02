import type { EntityGuard } from '../../../shared/application/ports/entity-guard.port.js';
import { Trait } from '../../domain/aggregates/trait.js';

export const TRAIT_GUARD = Symbol('TraitGuardPort');

export type TraitGuardPort = EntityGuard<Trait>;
