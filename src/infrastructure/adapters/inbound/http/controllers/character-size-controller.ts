import { injectable, inject } from 'inversify';
import { Request, Response } from 'express';
import { TYPES } from '@shared/types/container';
import { CharacterSizeService } from '@application/services/character-size-service';

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

  
}
