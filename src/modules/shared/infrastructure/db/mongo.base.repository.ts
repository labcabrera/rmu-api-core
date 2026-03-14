import { Model } from 'mongoose';
import { RsqlParser } from 'src/modules/shared/infrastructure/persistence/repositories/rsql-parser';
import { Page } from 'src/modules/shared/domain/entities/page';
import { NotFoundError } from 'src/modules/shared/domain/errors/errors';
import { BaseAggregateRoot } from '../../domain/aggregates/base-aggregate';

export abstract class MongoBaseRepository<E extends BaseAggregateRoot<any>, D> {
  constructor(
    protected model: Model<D>,
    protected rsqlParser: RsqlParser,
  ) {}

  async findById(id: string): Promise<E | null> {
    const readed = await this.model.findById(id);
    return readed ? this.mapToEntity(readed) : null;
  }

  async findByRsql(rsql: string, page: number, size: number): Promise<Page<E>> {
    const skip = page * size;
    const mongoQuery = this.rsqlParser.parse(rsql);
    const [docs, totalElements] = await Promise.all([
      this.model.find(mongoQuery).skip(skip).limit(size).sort({ name: 1 }),
      this.model.countDocuments(mongoQuery),
    ]);
    const content = docs.map((doc) => this.mapToEntity(doc));
    return new Page<E>(content, page, size, totalElements);
  }

  async save(entity: E): Promise<E> {
    // If entity exposes `getProps()` use it, otherwise use the entity itself
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
    const props = entity.getProps();
    // prefer id from props, fall back to entity
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const id = props?.id ?? (entity as any).id;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const model = new this.model({ ...props, _id: id });
    await model.save();
    return this.mapToEntity(model);
  }

  async update(entityId: string, partialEntity: Partial<E>): Promise<E> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unused-vars
    const { id, ...rest } = partialEntity as any;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const update = { $set: rest } as any;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const updatedEntity = await this.model.findByIdAndUpdate(entityId, update, { new: true });
    if (!updatedEntity) throw new NotFoundError('Entity', entityId);
    return this.mapToEntity(updatedEntity);
  }

  async deleteById(id: string): Promise<E | null> {
    const result = await this.model.findByIdAndDelete(id);
    return result ? this.mapToEntity(result) : null;
  }

  async existsById(id: string): Promise<boolean> {
    const exists = await this.model.exists({ _id: id });
    return exists !== null;
  }

  protected abstract mapToEntity(doc: D): E;
}
