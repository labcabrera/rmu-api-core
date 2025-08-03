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
    // Crear una nueva instancia del controlador con mocks
    raceController = new RaceController(
      mockRaceService as any,
      mockCreateRaceUseCase as any,
      mockDeleteRaceUseCase as any,
      mockUpdateRaceUseCase as any
    );

    // Reset de mocks
    jest.clearAllMocks();

    // Mock del request
    mockRequest = {
      params: {},
      query: {},
      body: {}
    };

    // Mock del response
    mockResponse = {
      json: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis()
    };

    // Mock del next function
    mockNext = jest.fn();
  });

  describe('findById', () => {
    it('should return a race when found', async () => {
      // Arrange
      const raceId = 'test-race';
      mockRequest.params = { id: raceId };
      mockRaceService.findById.mockResolvedValue(sampleRace);

      // Act
      await raceController.findById(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(mockRaceService.findById).toHaveBeenCalledWith(raceId);
      expect(mockResponse.json).toHaveBeenCalledWith(sampleRace);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should call next with error when race not found', async () => {
      // Arrange
      const raceId = 'non-existent-race';
      const error = new NotFoundError('Race', raceId);
      mockRequest.params = { id: raceId };
      mockRaceService.findById.mockRejectedValue(error);

      // Act
      await raceController.findById(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(mockRaceService.findById).toHaveBeenCalledWith(raceId);
      expect(mockResponse.json).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('find', () => {
    it('should return paginated races', async () => {
      // Arrange
      mockRequest.query = { page: '0', size: '10' };
      mockRaceService.findAll.mockResolvedValue(sampleRacePage);

      // Act
      await raceController.find(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(mockRaceService.findAll).toHaveBeenCalledWith({
        name: undefined,
        realmId: undefined,
        page: 0,
        size: 10
      });
      expect(mockResponse.json).toHaveBeenCalledWith(sampleRacePage);
    });

    it('should use default pagination when not provided', async () => {
      // Arrange
      mockRequest.query = {};
      mockRaceService.findAll.mockResolvedValue(sampleRacePage);

      // Act
      await raceController.find(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(mockRaceService.findAll).toHaveBeenCalledWith({
        name: undefined,
        realmId: undefined,
        page: 0,
        size: 10
      });
    });
  });

  describe('create', () => {
    it('should create a new race successfully', async () => {
      // Arrange
      const createRaceCommand = {
        id: 'new-race',
        name: 'New Race',
        realm: 'test-realm'
      };
      mockRequest.body = createRaceCommand;
      mockCreateRaceUseCase.execute.mockResolvedValue(sampleRace);

      // Act
      await raceController.create(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(mockCreateRaceUseCase.execute).toHaveBeenCalledWith(createRaceCommand);
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(sampleRace);
    });

    it('should handle creation errors', async () => {
      // Arrange
      const createRaceCommand = {
        id: 'new-race',
        name: 'New Race',
        realm: 'test-realm'
      };
      const error = new NotFoundError('Realm', 'test-realm');
      mockRequest.body = createRaceCommand;
      mockCreateRaceUseCase.execute.mockRejectedValue(error);

      // Act
      await raceController.create(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(mockCreateRaceUseCase.execute).toHaveBeenCalledWith(createRaceCommand);
      expect(mockNext).toHaveBeenCalledWith(error);
      expect(mockResponse.status).not.toHaveBeenCalled();
      expect(mockResponse.json).not.toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('should delete a race successfully', async () => {
      // Arrange
      const raceId = 'test-race';
      mockRequest.params = { id: raceId };
      mockDeleteRaceUseCase.execute.mockResolvedValue(undefined);

      // Act
      await raceController.delete(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(mockDeleteRaceUseCase.execute).toHaveBeenCalledWith(raceId);
      expect(mockResponse.status).toHaveBeenCalledWith(204);
      expect(mockResponse.send).toHaveBeenCalled();
    });

    it('should handle deletion errors', async () => {
      // Arrange
      const raceId = 'test-race';
      const error = new NotFoundError('Race', raceId);
      mockRequest.params = { id: raceId };
      mockDeleteRaceUseCase.execute.mockRejectedValue(error);

      // Act
      await raceController.delete(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(mockDeleteRaceUseCase.execute).toHaveBeenCalledWith(raceId);
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});
