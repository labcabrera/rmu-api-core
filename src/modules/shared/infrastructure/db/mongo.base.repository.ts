import { Model } from 'mongoose';
import { RsqlParser } from 'src/modules/shared/infrastructure/persistence/repositories/rsql-parser';
import { Page } from 'src/modules/shared/domain/entities/page';
import { NotFoundError } from 'src/modules/shared/domain/errors/errors';

export abstract class MongoBaseRepository<E, D> {
  constructor(
    protected realmModel: Model<D>,
    protected rsqlParser: RsqlParser,
  ) {}

  async findById(id: string): Promise<E | null> {
    const readed = await this.realmModel.findById(id);
    return readed ? this.mapToEntity(readed) : null;
  }

  async findByRsql(rsql: string, page: number, size: number): Promise<Page<E>> {
    const skip = page * size;
    const mongoQuery = this.rsqlParser.parse(rsql);
    const [docs, totalElements] = await Promise.all([
      this.realmModel.find(mongoQuery).skip(skip).limit(size).sort({ name: 1 }),
      this.realmModel.countDocuments(mongoQuery),
    ]);
    const content = docs.map((doc) => this.mapToEntity(doc));
    return new Page<E>(content, page, size, totalElements);
  }

  async save(realm: Partial<E>): Promise<E> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
    const id = (realm as any).id;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const model = new this.realmModel({ ...realm, _id: id });
    await model.save();
    return this.mapToEntity(model);
  }

  async update(entityId: string, request: Partial<E>): Promise<E> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unused-vars
    const { id, ...rest } = request as any;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const update = { $set: rest } as any;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const updatedRealm = await this.realmModel.findByIdAndUpdate(entityId, update, { new: true });
    if (!updatedRealm) {
      throw new NotFoundError('Entity', entityId);
    }
    return this.mapToEntity(updatedRealm);
  }

  async deleteById(id: string): Promise<E | null> {
    const result = await this.realmModel.findByIdAndDelete(id);
    return result ? this.mapToEntity(result) : null;
  }

  async existsById(id: string): Promise<boolean> {
    const exists = await this.realmModel.exists({ _id: id });
    return exists !== null;
  }

  protected abstract mapToEntity(doc: D): E;
}
