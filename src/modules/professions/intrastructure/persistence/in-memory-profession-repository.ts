import { ProfessionRepository } from '../../application/ports/out/profession.repository';
import { Profession } from '../../domain/entities/profession.entity';
import { PROFESSIONS } from './professions-values';

export class InMemoryProfessionRepository implements ProfessionRepository {
  findById(id: string): Promise<Profession | null> {
    return Promise.resolve(PROFESSIONS.find((profession) => profession.id === id) || null);
  }

  findAll(): Promise<Profession[]> {
    return Promise.resolve(PROFESSIONS);
  }
}
