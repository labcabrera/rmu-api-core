import type { BaseRepository } from '../../../shared/application/ports/base-repository.port.js';
import { Trait } from '../../domain/aggregates/trait.js';

export const TRAIT_REPOSITORY = Symbol('TraitRepository');

export type TraitRepository = BaseRepository<Trait>;
