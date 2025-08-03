import { injectable, inject } from 'inversify';
import { Request, Response } from 'express';
import { CharacterSizeService } from '@application/services/character-size-service';

@injectable()
export class CharacterSizeController {
  constructor(@inject('CharacterSizeService') private characterSizeService: CharacterSizeService) {}

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

  async find(req: Request, res: Response): Promise<void> {
    try {
      const characterSizes = await this.characterSizeService.find();
      res.json(characterSizes);
    } catch (error) {
      const err = error as Error & { status?: number };
      res.status(err.status || 500).json({ message: err.message });
    }
  }
}
