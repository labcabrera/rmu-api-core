import { injectable, inject } from 'inversify';
import { Request, Response } from 'express';
import { SkillCategoryService } from '@application/services/skill-category-read.service';

@injectable()
export class SkillCategoryController {
  constructor(
    @inject('SkillCategoryReadService') private skillCategoryService: SkillCategoryService
  ) {}

  async findById(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;
      const skillCategory = await this.skillCategoryService.findById(id);
      res.json(skillCategory);
    } catch (error) {
      const err = error as Error & { status?: number };
      res.status(err.status || 500).json({ message: err.message });
    }
  }

  async find(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.skillCategoryService.findAll();
      res.json(result);
    } catch (error) {
      const err = error as Error & { status?: number };
      res.status(err.status || 500).json({ message: err.message });
    }
  }
}
