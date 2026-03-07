import { Profession, ProfessionProps } from 'src/modules/professions/domain/aggregates/profession';
import { Page } from 'src/modules/shared/domain/entities/page';

export interface ProfessionRepository {
  findById(id: string): Promise<Profession | null>;

  findByRsql(rsql: string | undefined, page: number, size: number): Promise<Page<Profession>>;

  save(entity: Profession): Promise<Profession>;

  update(id: string, entity: Partial<ProfessionProps>): Promise<Profession>;

  deleteById(id: string): Promise<Profession | null>;
}
