import { injectable, inject } from 'inversify';
import { Request, Response } from 'express';
import { SkillReadService } from '@application/services/skill-read-service';
import { SkillQuery } from '@domain/queries/skill-query';

@injectable()
export class SkillController {
  constructor(@inject('SkillReadService') private skillService: SkillReadService) {}

  async findById(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;
      const skill = await this.skillService.findById(id);
      res.json(skill);
    } catch (error) {
      const err = error as Error & { status?: number };
      res.status(err.status || 500).json({ message: err.message });
    }
  }

  async find(req: Request, res: Response): Promise<void> {
    try {
      const page = req.query.page ? parseInt(req.query.page as string) : 0;
      const size = req.query.size ? parseInt(req.query.size as string) : 500;
      const categoryId = req.query.categoryId ? (req.query.categoryId as string) : undefined;
      const query: SkillQuery = {
        categoryId: categoryId,
      };
      const result = await this.skillService.find(query, page, size);
      res.json(result);
    } catch (error) {
      const err = error as Error & { status?: number };
      res.status(err.status || 500).json({ message: err.message });
    }
  }
}
