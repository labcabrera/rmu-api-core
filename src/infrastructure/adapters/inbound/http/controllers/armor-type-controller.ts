import { injectable, inject } from 'inversify';
import { Request, Response } from 'express';
import { TYPES } from '@shared/types/container';
import { ArmorTypeService } from '@application/services/armor-type-service';

@injectable()
export class ArmorTypeController {
  constructor(
    @inject(TYPES.ArmorTypeService) private armorTypeService: ArmorTypeService
  ) {}

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

  async findAll(req: Request, res: Response): Promise<void> {
    try {
      const armorTypes = await this.armorTypeService.find();
      res.json(armorTypes);
    } catch (error) {
      const err = error as Error & { status?: number };
      res.status(err.status || 500).json({ message: err.message });
    }
  }


}
