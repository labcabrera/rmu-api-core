import { BaseEntityGuard } from 'src/modules/shared/infrastructure/security/base-entity-guard';
import { EffectTypeGuardPort } from '../../application/ports/effect-type-guard.port';
import { EffectType } from '../../domain/aggregates/effect-type';

export class EffectTypeGuardAdapter extends BaseEntityGuard<EffectType> implements EffectTypeGuardPort {}
