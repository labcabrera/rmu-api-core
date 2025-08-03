import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from 'inversify';
import { RealmService } from '@application/services/realm-service';
import { RealmQuery } from '@domain/queries/realm-query';
import { CreateRealmUseCase } from '@application/use-cases/create-realm.usecase';
import { DeleteRealmUseCase } from '@application/use-cases/delete-realm.usecase';
import { UpdateRealmUseCase } from '@application/use-cases/update-realm.usecase';
import { CreateRealmCommand } from '@application/commands/create-realm.command';
import { UpdateRealmCommand } from '@application/commands/update-realm.command';
import { DeleteRealmCommand } from '@application/commands/delete-realm.command';

@injectable()
export class RealmController {
  constructor(
    @inject('RealmService') private realmService: RealmService,
    @inject('CreateRealmUseCase') private createRealmUseCase: CreateRealmUseCase,
    @inject('DeleteRealmUseCase') private deleteRealmUseCase: DeleteRealmUseCase,
    @inject('UpdateRealmUseCase') private updateRealmUseCase: UpdateRealmUseCase
  ) {}

    async findById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const realm = await this.realmService.findById(id);
      res.json(realm);
    } catch (error) {
      next(error);
    }
  }

  async findAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const query: RealmQuery = {
        page: req.query.page ? parseInt(req.query.page as string) : 0,
        size: req.query.size ? parseInt(req.query.size as string) : 10,
      };
      const result = await this.realmService.findAll(query);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }



  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const command: CreateRealmCommand = { ...req.body };
      const newRealm = await this.createRealmUseCase.execute(command);
      res.status(201).json(newRealm);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const command: UpdateRealmCommand = {...req.body};
      const updated = await this.updateRealmUseCase.execute(command);
      res.json(updated);
    } catch (error) {
      next(error);
    }
  }

  async deleteById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const command: DeleteRealmCommand = { id: req.params.id };
      await this.deleteRealmUseCase.execute(command);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}
