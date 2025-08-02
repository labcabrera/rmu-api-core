import { injectable, inject } from 'inversify';
import { Request, Response } from 'express';
import { TYPES } from '@shared/types/container';
import { ArmorTypeService } from '@application/services/ArmorTypeService';
import { ArmorTypeCreateRequest, ArmorTypeUpdateRequest } from '@domain/entities/ArmorType';

@injectable()
export class ArmorTypeController {
  constructor(
    @inject(TYPES.ArmorTypeService) private armorTypeService: ArmorTypeService
  ) {}

  async findAll(req: Request, res: Response): Promise<void> {
    try {
      const armorTypes = await this.armorTypeService.findAll();
      res.json(armorTypes);
    } catch (error) {
      const err = error as Error & { status?: number };
      res.status(err.status || 500).json({ message: err.message });
    }
  }

  async findById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ message: 'Invalid armor type ID' });
        return;
      }
      
      const armorType = await this.armorTypeService.findById(id);
      res.json(armorType);
    } catch (error) {
      const err = error as Error & { status?: number };
      res.status(err.status || 500).json({ message: err.message });
    }
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const request: ArmorTypeCreateRequest = req.body;
      const armorType = await this.armorTypeService.create(request);
      res.status(201).json(armorType);
    } catch (error) {
      const err = error as Error & { status?: number };
      res.status(err.status || 500).json({ message: err.message });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ message: 'Invalid armor type ID' });
        return;
      }
      
      const request: ArmorTypeUpdateRequest = req.body;
      const armorType = await this.armorTypeService.update(id, request);
      res.json(armorType);
    } catch (error) {
      const err = error as Error & { status?: number };
      res.status(err.status || 500).json({ message: err.message });
    }
  }

  async deleteById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ message: 'Invalid armor type ID' });
        return;
      }
      
      await this.armorTypeService.deleteById(id);
      res.status(204).send();
    } catch (error) {
      const err = error as Error & { status?: number };
      res.status(err.status || 500).json({ message: err.message });
    }
  }
}
