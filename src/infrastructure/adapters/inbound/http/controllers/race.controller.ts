import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from 'inversify';
import { RaceService } from '@application/services/race-read.service';
import { RaceQuery } from '@domain/queries/race-query';
import { CreateRaceCommand } from '@application/commands/create-race.command';
import { CreateRaceUseCase } from '@application/use-cases/create-race.usecase';
import { DeleteRaceUseCase } from '@application/use-cases/delete-race.usecase';
import { UpdateRaceUseCase } from '@application/use-cases/update-race.usecase';
import { UpdateRaceCommand } from '@application/commands/update-race.command';
import { getAuthenticatedUser } from '@infrastructure/adapters/inbound/http/security/auth.utils';
import { DeleteRaceCommand } from '@application/commands/delete-race.command';

@injectable()
export class RaceController {
  constructor(
    @inject('RaceReadService') private raceService: RaceService,
    @inject('CreateRaceUseCase') private createRaceUseCase: CreateRaceUseCase,
    @inject('DeleteRaceUseCase') private deleteRaceUseCase: DeleteRaceUseCase,
    @inject('UpdateRaceUseCase') private updateRaceUseCase: UpdateRaceUseCase
  ) {}

  async findById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const race = await this.raceService.findById(id);
      res.json(race);
    } catch (error) {
      next(error);
    }
  }

  async find(req: Request, res: Response, next: NextFunction): Promise<void> {
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

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const command: CreateRaceCommand = {
        ...req.body,
        username: getAuthenticatedUser(req)!.username!,
      };
      const created = await this.createRaceUseCase.execute(command);
      res.status(201).json(created);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const command: UpdateRaceCommand = {
        ...req.body,
        id: req.params.id,
        username: getAuthenticatedUser(req)!.username!,
      };
      const updated = await this.updateRaceUseCase.execute(command);
      res.json(updated);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const command: DeleteRaceCommand = {
        id: req.params.id,
        username: getAuthenticatedUser(req)!.username!,
      };
      await this.deleteRaceUseCase.execute(command);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}
