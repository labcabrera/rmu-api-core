import type { BaseRepository } from '../../../shared/application/ports/base-repository.port.js';
import { EffectType } from '../../domain/aggregates/effect-type.js';

export const EFFECT_TYPE_REPOSITORY = Symbol('EffectTypeRepository');

export type EffectTypeRepository = BaseRepository<EffectType>;
