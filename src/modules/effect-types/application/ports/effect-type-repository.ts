import { BaseRepository } from '../../../shared/application/ports/base-repository';
import { EffectType } from '../../domain/aggregates/effect-type';

export type EffectTypeRepository = BaseRepository<EffectType>;
