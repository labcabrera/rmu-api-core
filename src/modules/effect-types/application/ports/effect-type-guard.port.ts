import { EntityGuard } from 'src/modules/shared/application/ports/entity-guard';
import { EffectType } from '../../domain/aggregates/effect-type';

export type EffectTypeGuardPort = EntityGuard<EffectType>;
