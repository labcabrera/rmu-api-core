import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from 'inversify';
import { RealmService } from '@application/services/realm-service';
import { UpdateRealmRequest } from '@domain/entities/realm';
import { RealmQuery } from '@domain/queries/realm-query';

@injectable()
export class RealmController {
  constructor(@inject('RealmService') private realmService: RealmService) {}

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

  async findById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const realm = await this.realmService.findById(id);
      res.json(realm);
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // const createRequest: CreateRealmRequest = req.body;
      const newRealm = {}; //await this.realmService.create(createRequest);
      res.status(201).json(newRealm);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const updateRequest: UpdateRealmRequest = req.body;
      const updatedRealm = await this.realmService.update(id, updateRequest);
      res.json(updatedRealm);
    } catch (error) {
      next(error);
    }
  }

  async deleteById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      console.log(`Realm delete << ${req.params.id}`);
      const { id } = req.params;
      await this.realmService.deleteById(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}
