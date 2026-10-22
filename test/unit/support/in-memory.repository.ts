import type { BaseRepository } from '../../../src/modules/shared/application/ports/base-repository.port.js';
import { Page } from '../../../src/modules/shared/application/pagination/page.js';
import { NotFoundError } from '../../../src/modules/shared/domain/errors/errors.js';

type Entity = { id: string };

/**
 * BaseRepository double backed by a Map. findByRsql ignores the RSQL (handlers are tested, not the parser) and
 * returns the entities that `match` accepts, all of them by default; tests set `match` to emulate a query.
 */
export class InMemoryRepository<E extends Entity> implements BaseRepository<E> {
  readonly items = new Map<string, E>();
  match: (entity: E, rsql: string | undefined) => boolean = () => true;

  constructor(...entities: E[]) {
    entities.forEach(entity => this.items.set(entity.id, entity));
  }

  findById(id: string): Promise<E | null> {
    return Promise.resolve(this.items.get(id) ?? null);
  }

  findByRsql(rsql: string | undefined, page: number, size: number): Promise<Page<E>> {
    const all = [...this.items.values()].filter(entity => this.match(entity, rsql));
    return Promise.resolve(new Page(all.slice(page * size, (page + 1) * size), page, size, all.length));
  }

  save(entity: E): Promise<E> {
    this.items.set(entity.id, entity);
    return Promise.resolve(entity);
  }

  update(id: string, entity: E): Promise<E> {
    if (!this.items.has(id)) throw new NotFoundError('Entity', id);
    this.items.set(id, entity);
    return Promise.resolve(entity);
  }

  deleteById(id: string): Promise<E | null> {
    const entity = this.items.get(id) ?? null;
    this.items.delete(id);
    return Promise.resolve(entity);
  }

  existsById(id: string): Promise<boolean> {
    return Promise.resolve(this.items.has(id));
  }
}
