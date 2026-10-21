import type { BaseRepository } from '../../../shared/application/ports/base-repository.js';
import { Trait } from '../../domain/aggregates/trait.js';

export type TraitRepository = BaseRepository<Trait>;
