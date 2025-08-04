import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from 'inversify';
import { RealmReadService } from '@application/services/realm-read.service';
import { CreateRealmUseCase } from '@application/use-cases/create-realm.usecase';
import { DeleteRealmUseCase } from '@application/use-cases/delete-realm.usecase';
import { UpdateRealmUseCase } from '@application/use-cases/update-realm.usecase';
import { CreateRealmCommand } from '@application/commands/create-realm.command';
import { UpdateRealmCommand } from '@application/commands/update-realm.command';
import { DeleteRealmCommand } from '@application/commands/delete-realm.command';
import { getAuthenticatedUser } from '../security/auth.utils';

@injectable()
export class RealmController {
  constructor(
    @inject('RealmReadService') private realmService: RealmReadService,
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

  async find(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = req.query.page ? parseInt(req.query.page as string) : 0;
      const size = req.query.size ? parseInt(req.query.size as string) : 10;
      const rsql = req.query.q as string;
      const result = await this.realmService.findByRsql(rsql, page, size);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const command: CreateRealmCommand = {
        ...req.body,
        username: getAuthenticatedUser(req)?.username!,
      };
      const newRealm = await this.createRealmUseCase.execute(command);
      res.status(201).json(newRealm);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const command: UpdateRealmCommand = {
        ...req.body,
        id: req.params.id,
        username: getAuthenticatedUser(req)?.username!,
      };
      const updated = await this.updateRealmUseCase.execute(command);
      res.json(updated);
    } catch (error) {
      next(error);
    }
  }

  async deleteById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const command: DeleteRealmCommand = {
        id: req.params.id,
        username: getAuthenticatedUser(req)?.username!,
      };
      await this.deleteRealmUseCase.execute(command);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}
