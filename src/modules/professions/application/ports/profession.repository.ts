import { Profession } from 'src/modules/professions/domain/aggregates/profession';
import { BaseRepository } from 'src/modules/shared/application/ports/repository';

export type ProfessionRepository = BaseRepository<Profession>;
