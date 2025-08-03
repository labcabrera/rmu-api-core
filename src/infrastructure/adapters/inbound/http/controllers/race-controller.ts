import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from 'inversify';
import { RaceService } from '@application/services/race-service';
import { CreateRaceRequest, UpdateRaceRequest } from '@domain/entities/race';
import { PaginationOptions } from '@shared/types';
import { TYPES } from '@shared/types/container';

@injectable()
export class RaceController {
  constructor(@inject(TYPES.RaceService) private raceService: RaceService) {}

  async findAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = req.query.page ? parseInt(req.query.page as string) : 0;
      const size = req.query.size ? parseInt(req.query.size as string) : 10;

      const options: PaginationOptions = { page, size };
      const result = await this.raceService.findAll(options);

      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async findById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const race = await this.raceService.findById(id);
      res.json(race);
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      console.log(`Race creation << ${req.body.name}`);
      const createRequest: CreateRaceRequest = req.body;
      const newRace = await this.raceService.create(createRequest);
      res.status(201).json(newRace);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const updateRequest: UpdateRaceRequest = req.body;
      const updatedRace = await this.raceService.update(id, updateRequest);
      res.json(updatedRace);
    } catch (error) {
      next(error);
    }
  }

  async deleteById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      console.log(`Race delete << ${req.params.id}`);
      const { id } = req.params;
      await this.raceService.deleteById(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}
