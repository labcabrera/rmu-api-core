import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import type { SkillDifficultyRepository } from '../../application/ports/skill-difficulty-repository.port.js';
import type { SkillDifficultyGuide } from '../../domain/value-objects/skill-difficulty-guide.vo.js';
import { type SkillDifficultyDocument, SkillDifficultyModel } from '../persistence/models/skill-difficulty.model.js';

@Injectable()
export class MongoSkillDifficultyRepository implements SkillDifficultyRepository {
  constructor(@InjectModel(SkillDifficultyModel.name) private readonly model: Model<SkillDifficultyDocument>) {}

  async findById(skillId: string): Promise<SkillDifficultyGuide | null> {
    const doc = await this.model.findById(skillId).lean<SkillDifficultyModel>();
    return doc ? MongoSkillDifficultyRepository.mapToGuide(doc) : null;
  }

  async findAll(): Promise<SkillDifficultyGuide[]> {
    const docs = await this.model.find().sort({ _id: 1 }).lean<SkillDifficultyModel[]>();
    return docs.map(doc => MongoSkillDifficultyRepository.mapToGuide(doc));
  }

  static mapToGuide(doc: SkillDifficultyModel): SkillDifficultyGuide {
    const guide: SkillDifficultyGuide = {
      skillId: doc._id,
      examples: (doc.examples || []).map(example => ({ difficulty: example.difficulty, text: { ...example.text } })),
    };
    if (doc.context) guide.context = { ...doc.context };
    if (doc.sharedWith) guide.sharedWith = doc.sharedWith;
    return guide;
  }
}
