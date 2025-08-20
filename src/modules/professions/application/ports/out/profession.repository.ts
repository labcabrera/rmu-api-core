import { Profession } from 'src/modules/professions/domain/entities/profession.entity';

export interface ProfessionRepository {
  findById(id: string): Promise<Profession | null>;

  findAll(): Promise<Profession[]>;
}
