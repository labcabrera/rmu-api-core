import { BaseRepository } from '../../../shared/application/ports/base-repository';
import { Trait } from '../../domain/aggregates/trait';

export type TraitRepository = BaseRepository<Trait>;
