import { injectable, inject } from 'inversify';
import { Request, Response } from 'express';
import { TYPES } from '@shared/types/container';
import { SkillService } from '@application/services/skill-service';

@injectable()
export class SkillController {
  constructor(
    @inject(TYPES.SkillService) private skillService: SkillService
  ) {}

  async findAll(req: Request, res: Response): Promise<void> {
    try {
      const page = req.query.page ? parseInt(req.query.page as string) : 0;
      const size = req.query.size ? parseInt(req.query.size as string) : 500;
      const result = await this.skillService.findAllPaginated(page, size);
      res.json(result);
    } catch (error) {
      const err = error as Error & { status?: number };
      res.status(err.status || 500).json({ message: err.message });
    }
  }

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
}
