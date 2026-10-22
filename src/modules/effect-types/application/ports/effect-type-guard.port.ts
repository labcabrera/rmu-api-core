import type { EntityGuard } from '../../../shared/application/ports/entity-guard.port.js';
import { EffectType } from '../../domain/aggregates/effect-type.js';

export const EFFECT_TYPE_GUARD = Symbol('EffectTypeGuardPort');

export type EffectTypeGuardPort = EntityGuard<EffectType>;
