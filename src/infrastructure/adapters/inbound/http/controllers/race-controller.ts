import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from 'inversify';
import { RaceService } from '@application/services/race-service';
import { UpdateRaceRequest } from '@domain/entities/race';
import { TYPES } from '@shared/types/container';
import { RaceQuery } from '@domain/queries/race-query';
import { CreateRaceCommand } from '@application/commands/create-race.command';

@injectable()
export class RaceController {
  constructor(@inject(TYPES.RaceService) private raceService: RaceService) {}

  async findAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const query: RaceQuery = {
        name: req.query.name as string,
        realmId: req.query.realmId as string,
        page: req.query.page ? parseInt(req.query.page as string) : 0,
        size: req.query.size ? parseInt(req.query.size as string) : 10,
      };
      const result = await this.raceService.findAll(query);
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
      const command: CreateRaceCommand = req.body;
      const created = await this.raceService.create(command);
      res.status(201).json(created);
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
