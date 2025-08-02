import { injectable, inject } from 'inversify';
import { Request, Response } from 'express';
import { TYPES } from '@shared/types/container';
import { CharacterSizeService } from '@application/services/CharacterSizeService';
import { CharacterSizeCreateRequest, CharacterSizeUpdateRequest } from '@domain/entities/CharacterSize';

@injectable()
export class CharacterSizeController {
  constructor(
    @inject(TYPES.CharacterSizeService) private characterSizeService: CharacterSizeService
  ) {}

  async findAll(req: Request, res: Response): Promise<void> {
    try {
      const characterSizes = await this.characterSizeService.findAll();
      res.json(characterSizes);
    } catch (error) {
      const err = error as Error & { status?: number };
      res.status(err.status || 500).json({ message: err.message });
    }
  }

  async findById(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;
      const characterSize = await this.characterSizeService.findById(id);
      res.json(characterSize);
    } catch (error) {
      const err = error as Error & { status?: number };
      res.status(err.status || 500).json({ message: err.message });
    }
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const request: CharacterSizeCreateRequest = req.body;
      const characterSize = await this.characterSizeService.create(request);
      res.status(201).json(characterSize);
    } catch (error) {
      const err = error as Error & { status?: number };
      res.status(err.status || 500).json({ message: err.message });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;
      const request: CharacterSizeUpdateRequest = req.body;
      const characterSize = await this.characterSizeService.update(id, request);
      res.json(characterSize);
    } catch (error) {
      const err = error as Error & { status?: number };
      res.status(err.status || 500).json({ message: err.message });
    }
  }

  async deleteById(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;
      await this.characterSizeService.deleteById(id);
      res.status(204).send();
    } catch (error) {
      const err = error as Error & { status?: number };
      res.status(err.status || 500).json({ message: err.message });
    }
  }

  async findAttackEffects(req: Request, res: Response): Promise<void> {
    try {
      const attackerSizeId = req.params.attackSizeId;
      const defenderSizeId = req.params.defenderSizeId;
      const attackEffects = await this.characterSizeService.findAttackEffects(attackerSizeId, defenderSizeId);
      res.json(attackEffects);
    } catch (error) {
      const err = error as Error & { status?: number };
      res.status(err.status || 500).json({ message: err.message });
    }
  }
}
