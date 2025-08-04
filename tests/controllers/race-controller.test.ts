import { Request, Response, NextFunction } from 'express';
import { RaceController } from '../../src/infrastructure/adapters/inbound/http/controllers/race.controller';
import { 
  mockRaceService, 
  mockCreateRaceUseCase, 
  mockDeleteRaceUseCase, 
  mockUpdateRaceUseCase,
  sampleRace,
  sampleRacePage 
} from '../mocks/race-mocks';
import { NotFoundError } from '../../src/domain/errors/errors';

describe('RaceController', () => {
  let raceController: RaceController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    raceController = new RaceController(
      mockRaceService as any,
      mockCreateRaceUseCase as any,
      mockDeleteRaceUseCase as any,
      mockUpdateRaceUseCase as any
    );

    jest.clearAllMocks();

    mockRequest = {
      params: {},
      query: {},
      body: {},
      user: {
        id: 'test-user',
        username: 'testuser',
        email: 'test@example.com',
        roles: ['user'],
        groups: [],
        realm: 'test'
      }
    };

    mockResponse = {
      json: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis()
    };

    mockNext = jest.fn();
  });

  describe('findById', () => {
    it('should return a race when found', async () => {
      const raceId = 'test-race';
      mockRequest.params = { id: raceId };
      mockRaceService.findById.mockResolvedValue(sampleRace);
      await raceController.findById(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );
      expect(mockRaceService.findById).toHaveBeenCalledWith(raceId);
      expect(mockResponse.json).toHaveBeenCalledWith(sampleRace);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should call next with error when race not found', async () => {
      const raceId = 'non-existent-race';
      const error = new NotFoundError('Race', raceId);
      mockRequest.params = { id: raceId };
      mockRaceService.findById.mockRejectedValue(error);

      await raceController.findById(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockRaceService.findById).toHaveBeenCalledWith(raceId);
      expect(mockResponse.json).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('find', () => {
    it('should return paginated races', async () => {
      mockRequest.query = { page: '0', size: '10' };
      mockRaceService.findByRsql.mockResolvedValue(sampleRacePage);

      await raceController.find(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockRaceService.findByRsql).toHaveBeenCalledWith(undefined, 0, 10);
      expect(mockResponse.json).toHaveBeenCalledWith(sampleRacePage);
    });

    it('should use default pagination when not provided', async () => {
      mockRequest.query = {};
      mockRaceService.findByRsql.mockResolvedValue(sampleRacePage);

      await raceController.find(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockRaceService.findByRsql).toHaveBeenCalledWith(undefined, 0, 10);
    });

    it('should handle RSQL queries', async () => {
      mockRequest.query = { q: 'name==test', page: '1', size: '5' };
      mockRaceService.findByRsql.mockResolvedValue(sampleRacePage);

      await raceController.find(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockRaceService.findByRsql).toHaveBeenCalledWith('name==test', 1, 5);
      expect(mockResponse.json).toHaveBeenCalledWith(sampleRacePage);
    });
  });

  describe('create', () => {
    it('should create a new race successfully', async () => {
      const createRaceCommand = {
        id: 'new-race',
        name: 'New Race',
        realm: 'test-realm'
      };
      mockRequest.body = createRaceCommand;
      mockCreateRaceUseCase.execute.mockResolvedValue(sampleRace);

      await raceController.create(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      const expectedCommand = {
        ...createRaceCommand,
        username: 'testuser'
      };
      expect(mockCreateRaceUseCase.execute).toHaveBeenCalledWith(expectedCommand);
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(sampleRace);
    });

    it('should handle creation errors', async () => {
      const createRaceCommand = {
        id: 'new-race',
        name: 'New Race',
        realm: 'test-realm'
      };
      const error = new NotFoundError('Realm', 'test-realm');
      mockRequest.body = createRaceCommand;
      mockCreateRaceUseCase.execute.mockRejectedValue(error);

      await raceController.create(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      const expectedCommand = {
        ...createRaceCommand,
        username: 'testuser'
      };
      expect(mockCreateRaceUseCase.execute).toHaveBeenCalledWith(expectedCommand);
      expect(mockNext).toHaveBeenCalledWith(error);
      expect(mockResponse.status).not.toHaveBeenCalled();
      expect(mockResponse.json).not.toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('should delete a race successfully', async () => {
      const raceId = 'test-race';
      mockRequest.params = { id: raceId };
      mockDeleteRaceUseCase.execute.mockResolvedValue(undefined);

      await raceController.delete(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      const expectedCommand = {
        id: raceId,
        username: 'testuser'
      };
      expect(mockDeleteRaceUseCase.execute).toHaveBeenCalledWith(expectedCommand);
      expect(mockResponse.status).toHaveBeenCalledWith(204);
      expect(mockResponse.send).toHaveBeenCalled();
    });

    it('should handle deletion errors', async () => {
      const raceId = 'test-race';
      const error = new NotFoundError('Race', raceId);
      mockRequest.params = { id: raceId };
      mockDeleteRaceUseCase.execute.mockRejectedValue(error);

      await raceController.delete(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      const expectedCommand = {
        id: raceId,
        username: 'testuser'
      };
      expect(mockDeleteRaceUseCase.execute).toHaveBeenCalledWith(expectedCommand);
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});
