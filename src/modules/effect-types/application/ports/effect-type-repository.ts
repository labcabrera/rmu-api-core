import type { BaseRepository } from '../../../shared/application/ports/base-repository.js';
import { EffectType } from '../../domain/aggregates/effect-type.js';

export type EffectTypeRepository = BaseRepository<EffectType>;
