import { injectable, inject } from 'inversify';
import { Request, Response } from 'express';
import { TYPES } from '@shared/types/container';
import { SkillCategoryService } from '@application/services/SkillCategoryService';
import { SkillCategoryCreateRequest, SkillCategoryUpdateRequest } from '@domain/entities/SkillCategory';

@injectable()
export class SkillCategoryController {
  constructor(
    @inject(TYPES.SkillCategoryService) private skillCategoryService: SkillCategoryService
  ) {}

  async findAll(req: Request, res: Response): Promise<void> {
    try {
      const page = req.query.page ? parseInt(req.query.page as string) : 0;
      const size = req.query.size ? parseInt(req.query.size as string) : 10;
      const result = await this.skillCategoryService.findAllPaginated(page, size);
      res.json(result);
    } catch (error) {
      const err = error as Error & { status?: number };
      res.status(err.status || 500).json({ message: err.message });
    }
  }

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

  async create(req: Request, res: Response): Promise<void> {
    try {
      const request: SkillCategoryCreateRequest = req.body;
      const skillCategory = await this.skillCategoryService.create(request);
      res.status(201).json(skillCategory);
    } catch (error) {
      const err = error as Error & { status?: number };
      res.status(err.status || 500).json({ message: err.message });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;
      const request: SkillCategoryUpdateRequest = req.body;
      const skillCategory = await this.skillCategoryService.update(id, request);
      res.json(skillCategory);
    } catch (error) {
      const err = error as Error & { status?: number };
      res.status(err.status || 500).json({ message: err.message });
    }
  }

  async deleteById(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;
      await this.skillCategoryService.deleteById(id);
      res.status(204).send();
    } catch (error) {
      const err = error as Error & { status?: number };
      res.status(err.status || 500).json({ message: err.message });
    }
  }
}
