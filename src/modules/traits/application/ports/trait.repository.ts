import { BaseRepository } from 'src/modules/shared/application/ports/repository';
import { Trait } from 'src/modules/traits/domain/aggregates/trait';

export type TraitRepository = BaseRepository<Trait>;
