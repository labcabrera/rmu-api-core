import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RsqlParser } from 'src/modules/shared/infrastructure/persistence/repositories/rsql-parser';
import { ProfessionRepository } from '../../application/ports/profession.repository';
import { ProfessionDocument, ProfessionModel } from '../persistence/models/profession-model';
import { Profession } from '../../domain/aggregates/profession';
import { MongoBaseRepository } from 'src/modules/shared/infrastructure/db/mongo.base.repository';

@Injectable()
export class MongoProfessionRepository extends MongoBaseRepository<Profession, ProfessionDocument> implements ProfessionRepository {
  constructor(@InjectModel(ProfessionModel.name) professionModel: Model<ProfessionDocument>, rsqlParser: RsqlParser) {
    super(professionModel, rsqlParser);
  }

  // async findById(id: string): Promise<Profession | null> {
  //   const readed = await this.professionModel.findById(id);
  //   return readed ? this.mapToEntity(readed) : null;
  // }

  // async findByRsql(rsql: string, page: number, size: number): Promise<Page<Profession>> {
  //   const skip = page * size;
  //   const mongoQuery = this.rsqlParser.parse(rsql);
  //   const [professionsDocs, totalElements] = await Promise.all([
  //     this.professionModel.find(mongoQuery).skip(skip).limit(size).sort({ _id: 1 }),
  //     this.professionModel.countDocuments(mongoQuery),
  //   ]);
  //   const content = professionsDocs.map((doc) => this.mapToEntity(doc));
  //   return new Page<Profession>(content, page, size, totalElements);
  // }

  // async save(profession: Profession): Promise<Profession> {
  //   const props = profession.toProps();
  //   const model = new this.professionModel({ ...props, _id: profession.id });
  //   await model.save();
  //   return this.mapToEntity(model);
  // }

  // async update(id: string, request: Partial<Profession>): Promise<Profession> {
  //   const updatedProfession = await this.professionModel.findByIdAndUpdate(id, request, { new: true });
  //   if (!updatedProfession) {
  //     throw new NotFoundError('Profession', id);
  //   }
  //   return this.mapToEntity(updatedProfession);
  // }

  // async deleteById(id: string): Promise<Profession | null> {
  //   const result = await this.professionModel.findByIdAndDelete(id);
  //   return result ? this.mapToEntity(result) : null;
  // }

  // async existsById(id: string): Promise<boolean> {
  //   const exists = await this.professionModel.exists({ _id: id });
  //   return exists !== null;
  // }

  protected mapToEntity(doc: ProfessionDocument): Profession {
    return Profession.fromProps({
      id: doc.id as string,
      archetype: doc.archetype,
      availableRealmTypes: doc.availableRealmTypes,
      fixedRealmTypes: doc.fixedRealmTypes,
      skillCosts: doc.skillCosts,
      professionalSkills: doc.professionalSkills,
      entitySource: doc.entitySource,
      description: doc.description,
      imageUrl: doc.imageUrl,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
      owner: doc.owner,
      accessType: doc.accessType,
    });
  }
}
