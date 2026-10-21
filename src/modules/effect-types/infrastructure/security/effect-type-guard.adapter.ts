import { BaseEntityGuard } from '../../../shared/infrastructure/security/base-entity-guard.js';
import type { EffectTypeGuardPort } from '../../application/ports/effect-type-guard.port.js';
import { EffectType } from '../../domain/aggregates/effect-type.js';

export class EffectTypeGuardAdapter extends BaseEntityGuard<EffectType> implements EffectTypeGuardPort {}
