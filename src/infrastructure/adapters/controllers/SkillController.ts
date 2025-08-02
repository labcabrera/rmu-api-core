import { injectable, inject } from 'inversify';
import { Request, Response } from 'express';
import { TYPES } from '@shared/types/container';
import { SkillService } from '@application/services/SkillService';
import { SkillCreateRequest, SkillUpdateRequest } from '@domain/entities/Skill';

@injectable()
export class SkillController {
  constructor(
    @inject(TYPES.SkillService) private skillService: SkillService
  ) {}

  async findAll(req: Request, res: Response): Promise<void> {
    try {
      const page = req.query.page ? parseInt(req.query.page as string) : 0;
      const size = req.query.size ? parseInt(req.query.size as string) : 10;
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

  async create(req: Request, res: Response): Promise<void> {
    try {
      const request: SkillCreateRequest = req.body;
      const skill = await this.skillService.create(request);
      res.status(201).json(skill);
    } catch (error) {
      const err = error as Error & { status?: number };
      res.status(err.status || 500).json({ message: err.message });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;
      const request: SkillUpdateRequest = req.body;
      const skill = await this.skillService.update(id, request);
      res.json(skill);
    } catch (error) {
      const err = error as Error & { status?: number };
      res.status(err.status || 500).json({ message: err.message });
    }
  }

  async deleteById(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;
      await this.skillService.deleteById(id);
      res.status(204).send();
    } catch (error) {
      const err = error as Error & { status?: number };
      res.status(err.status || 500).json({ message: err.message });
    }
  }
}
