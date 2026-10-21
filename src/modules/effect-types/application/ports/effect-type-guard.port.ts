import type { EntityGuard } from '../../../shared/application/ports/entity-guard.js';
import { EffectType } from '../../domain/aggregates/effect-type.js';

export type EffectTypeGuardPort = EntityGuard<EffectType>;
