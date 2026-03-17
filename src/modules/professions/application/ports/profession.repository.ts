import { Profession } from 'src/modules/professions/domain/aggregates/profession';
import { BaseRepository } from 'src/modules/shared/application/ports/base-repository';

export type ProfessionRepository = BaseRepository<Profession>;
