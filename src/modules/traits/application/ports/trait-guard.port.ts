import type { EntityGuard } from '../../../shared/application/ports/entity-guard.js';
import { Trait } from '../../domain/aggregates/trait.js';

export type TraitGuardPort = EntityGuard<Trait>;
