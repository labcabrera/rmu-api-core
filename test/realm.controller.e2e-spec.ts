import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import supertest from 'supertest';
import { JwtAuthGuard } from '../src/modules/auth/jwt.auth.guard';
import { RealmController } from '../src/modules/realms/infrastructure/controllers/realm.controller';
import { Realm } from '../src/modules/realms/domain/entities/realm';
import { Page } from '../src/modules/core/domain/entities/page';
import { CreateRealmCommand } from '../src/modules/core/application/commands/create-realm.command';
import { UpdateRealmCommand } from '../src/modules/core/application/commands/update-realm.command';
import { DeleteRealmCommand } from '../src/modules/core/application/commands/delete-realm.command';

describe('RealmController (e2e)', () => {
  let app: INestApplication;
  let commandBus: CommandBus;
  let queryBus: QueryBus;

  // Mock data
  const mockUser = {
    id: 'user-123',
    email: 'test@example.com',
    roles: ['admin', 'realm-manager'],
  };

  const mockRealm: Realm = {
    id: 'test-realm',
    name: 'Test Realm',
    description: 'A test realm for unit testing',
    owner: mockUser.id,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  };

  const mockRealmList: Realm[] = [
    mockRealm,
    {
      id: 'fantasy-realm',
      name: 'Fantasy Realm',
      description: 'A magical fantasy world',
      owner: mockUser.id,
      createdAt: new Date('2024-01-02'),
      updatedAt: new Date('2024-01-02'),
    },
  ];

  const mockPage = new Page(mockRealmList, 0, 10, 2);

  beforeEach(async () => {
    const mockCommandBus = {
      execute: jest.fn(),
    };

    const mockQueryBus = {
      execute: jest.fn(),
    };

    // Mock del guard de autenticación
    const mockJwtAuthGuard = {
      canActivate: jest.fn(() => true),
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [RealmController],
      providers: [
        {
          provide: CommandBus,
          useValue: mockCommandBus,
        },
        {
          provide: QueryBus,
          useValue: mockQueryBus,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue(mockJwtAuthGuard)
      .compile();

    app = moduleFixture.createNestApplication();

    // Configurar ValidationPipe
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    );

    // Mock request user para simular autenticación
    app.use((req, res, next) => {
      req.user = mockUser;
      next();
    });

    commandBus = moduleFixture.get<CommandBus>(CommandBus);
    queryBus = moduleFixture.get<QueryBus>(QueryBus);

    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('GET /v1/realms/:id', () => {
    it('should return a realm by id', async () => {
      // Arrange
      const realmId = 'test-realm';
      jest.spyOn(queryBus, 'execute').mockResolvedValue(mockRealm);

      // Act & Assert
      const response = await supertest(app.getHttpServer())
        .get(`/v1/realms/${realmId}`)
        .set('Authorization', 'Bearer mock-token')
        .expect(200);

      expect(response.body).toEqual({
        id: mockRealm.id,
        name: mockRealm.name,
        description: mockRealm.description,
      });

      expect(queryBus.execute).toHaveBeenCalledWith(
        expect.objectContaining({
          id: realmId,
          userId: mockUser.id,
        }),
      );
    });

    it('should return 500 when realm not found', async () => {
      // Arrange
      const realmId = 'non-existent-realm';
      jest.spyOn(queryBus, 'execute').mockRejectedValue(new Error('Realm not found'));

      // Act & Assert
      await request(app.getHttpServer()).get(`/v1/realms/${realmId}`).set('Authorization', 'Bearer mock-token').expect(500);
    });
  });

  describe('GET /v1/realms', () => {
    it('should return paginated realms', async () => {
      // Arrange
      jest.spyOn(queryBus, 'execute').mockResolvedValue(mockPage);

      // Act & Assert
      const response = await request(app.getHttpServer())
        .get('/v1/realms')
        .query({ page: 0, size: 10 })
        .set('Authorization', 'Bearer mock-token')
        .expect(200);

      expect(response.body.content).toHaveLength(2);
      expect(response.body.pagination.totalElements).toBe(2);
    });

    it('should support RSQL queries', async () => {
      // Arrange
      const rsqlQuery = 'name=="Test Realm"';
      const filteredPage = new Page([mockRealm], 0, 10, 1);
      jest.spyOn(queryBus, 'execute').mockResolvedValue(filteredPage);

      // Act & Assert
      const response = await request(app.getHttpServer())
        .get('/v1/realms')
        .query({ q: rsqlQuery, page: 0, size: 10 })
        .set('Authorization', 'Bearer mock-token')
        .expect(200);

      expect(response.body.content).toHaveLength(1);
      expect(response.body.pagination.totalElements).toBe(1);
    });

    it('should use default pagination values', async () => {
      // Arrange
      jest.spyOn(queryBus, 'execute').mockResolvedValue(mockPage);

      // Act & Assert
      await request(app.getHttpServer()).get('/v1/realms').set('Authorization', 'Bearer mock-token').expect(200);
    });
  });

  describe('POST /v1/realms', () => {
    it('should create a new realm', async () => {
      // Arrange
      const createRealmDto = {
        id: 'new-realm',
        name: 'New Realm',
        description: 'A brand new realm',
      };

      const createdRealm: Realm = {
        ...createRealmDto,
        owner: mockUser.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(commandBus, 'execute').mockResolvedValue(createdRealm);

      // Act & Assert
      const response = await request(app.getHttpServer())
        .post('/v1/realms')
        .send(createRealmDto)
        .set('Authorization', 'Bearer mock-token')
        .set('Content-Type', 'application/json')
        .expect(201);

      expect(response.body.id).toBe(createRealmDto.id);
      expect(response.body.name).toBe(createRealmDto.name);
      expect(response.body.description).toBe(createRealmDto.description);

      const commandBusExecute = commandBus.execute as jest.Mock;
      expect(commandBusExecute).toHaveBeenCalledWith(expect.any(CreateRealmCommand));
    });

    it('should reject invalid realm data (missing id)', async () => {
      // Arrange
      const invalidRealmDto = {
        name: 'New Realm',
        description: 'A brand new realm',
        // Missing required 'id' field
      };

      // Act & Assert
      await request(app.getHttpServer())
        .post('/v1/realms')
        .send(invalidRealmDto)
        .set('Authorization', 'Bearer mock-token')
        .set('Content-Type', 'application/json')
        .expect(400);

      const commandBusExecute = commandBus.execute as jest.Mock;
      expect(commandBusExecute).not.toHaveBeenCalled();
    });

    it('should reject realm with empty id', async () => {
      // Arrange
      const invalidRealmDto = {
        id: '', // Empty id
        name: 'New Realm',
        description: 'A brand new realm',
      };

      // Act & Assert
      await request(app.getHttpServer())
        .post('/v1/realms')
        .send(invalidRealmDto)
        .set('Authorization', 'Bearer mock-token')
        .set('Content-Type', 'application/json')
        .expect(400);

      const commandBusExecute = commandBus.execute as jest.Mock;
      expect(commandBusExecute).not.toHaveBeenCalled();
    });

    it('should allow realm creation without description', async () => {
      // Arrange
      const createRealmDto = {
        id: 'minimal-realm',
        name: 'Minimal Realm',
      };

      const createdRealm: Realm = {
        ...createRealmDto,
        description: undefined,
        owner: mockUser.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(commandBus, 'execute').mockResolvedValue(createdRealm);

      // Act & Assert
      const response = await request(app.getHttpServer())
        .post('/v1/realms')
        .send(createRealmDto)
        .set('Authorization', 'Bearer mock-token')
        .set('Content-Type', 'application/json')
        .expect(201);

      expect(response.body.id).toBe(createRealmDto.id);

      const commandBusExecute = commandBus.execute as jest.Mock;
      expect(commandBusExecute).toHaveBeenCalledWith(expect.any(CreateRealmCommand));
    });
  });

  describe('PATCH /v1/realms/:id', () => {
    it('should update an existing realm', async () => {
      // Arrange
      const realmId = 'test-realm';
      const updateRealmDto = {
        name: 'Updated Realm Name',
        description: 'Updated description',
      };

      const updatedRealm: Realm = {
        id: realmId,
        name: updateRealmDto.name,
        description: updateRealmDto.description,
        owner: mockUser.id,
        createdAt: mockRealm.createdAt,
        updatedAt: new Date(),
      };

      jest.spyOn(commandBus, 'execute').mockResolvedValue(updatedRealm);

      // Act & Assert
      const response = await request(app.getHttpServer())
        .patch(`/v1/realms/${realmId}`)
        .send(updateRealmDto)
        .set('Authorization', 'Bearer mock-token')
        .set('Content-Type', 'application/json')
        .expect(200);

      expect(response.body.name).toBe(updateRealmDto.name);
      expect(response.body.description).toBe(updateRealmDto.description);

      const commandBusExecute = commandBus.execute as jest.Mock;
      expect(commandBusExecute).toHaveBeenCalledWith(expect.any(UpdateRealmCommand));
    });

    it('should allow partial updates', async () => {
      // Arrange
      const realmId = 'test-realm';
      const updateRealmDto = {
        name: 'Only Name Updated',
        // No description update
      };

      const updatedRealm: Realm = {
        id: realmId,
        name: updateRealmDto.name,
        description: mockRealm.description,
        owner: mockUser.id,
        createdAt: mockRealm.createdAt,
        updatedAt: new Date(),
      };

      jest.spyOn(commandBus, 'execute').mockResolvedValue(updatedRealm);

      // Act & Assert
      const response = await request(app.getHttpServer())
        .patch(`/v1/realms/${realmId}`)
        .send(updateRealmDto)
        .set('Authorization', 'Bearer mock-token')
        .set('Content-Type', 'application/json')
        .expect(200);

      expect(response.body.name).toBe(updateRealmDto.name);

      const commandBusExecute = commandBus.execute as jest.Mock;
      expect(commandBusExecute).toHaveBeenCalledWith(expect.any(UpdateRealmCommand));
    });
  });

  describe('DELETE /v1/realms/:id', () => {
    it('should delete an existing realm', async () => {
      // Arrange
      const realmId = 'test-realm';
      jest.spyOn(commandBus, 'execute').mockResolvedValue(undefined);

      // Act & Assert
      await request(app.getHttpServer()).delete(`/v1/realms/${realmId}`).set('Authorization', 'Bearer mock-token').expect(204);

      const commandBusExecute = commandBus.execute as jest.Mock;
      expect(commandBusExecute).toHaveBeenCalledWith(expect.any(DeleteRealmCommand));
    });

    it('should handle deletion of non-existent realm', async () => {
      // Arrange
      const realmId = 'non-existent-realm';
      jest.spyOn(commandBus, 'execute').mockRejectedValue(new Error('Realm not found'));

      // Act & Assert
      await request(app.getHttpServer()).delete(`/v1/realms/${realmId}`).set('Authorization', 'Bearer mock-token').expect(500);
    });
  });

  describe('Input Validation', () => {
    it('should validate pagination parameters (negative page)', async () => {
      // Arrange
      jest.spyOn(queryBus, 'execute').mockResolvedValue(mockPage);

      // Act & Assert
      await request(app.getHttpServer())
        .get('/v1/realms')
        .query({ page: -1, size: 10 })
        .set('Authorization', 'Bearer mock-token')
        .expect(400);
    });

    it('should validate size parameter limits (too large)', async () => {
      // Arrange
      jest.spyOn(queryBus, 'execute').mockResolvedValue(mockPage);

      // Act & Assert
      await request(app.getHttpServer())
        .get('/v1/realms')
        .query({ page: 0, size: 1000 })
        .set('Authorization', 'Bearer mock-token')
        .expect(400);
    });
  });

  describe('Command and Query Verification', () => {
    it('should verify CreateRealmCommand is called with correct parameters', async () => {
      // Arrange
      const createRealmDto = {
        id: 'verify-realm',
        name: 'Verify Realm',
        description: 'Testing command verification',
      };

      const createdRealm: Realm = {
        ...createRealmDto,
        owner: mockUser.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const executeSpy = jest.spyOn(commandBus, 'execute').mockResolvedValue(createdRealm);

      // Act
      await request(app.getHttpServer())
        .post('/v1/realms')
        .send(createRealmDto)
        .set('Authorization', 'Bearer mock-token')
        .set('Content-Type', 'application/json')
        .expect(201);

      // Assert
      expect(executeSpy).toHaveBeenCalledWith(expect.any(CreateRealmCommand));
      expect(executeSpy).toHaveBeenCalledTimes(1);
    });

    it('should verify UpdateRealmCommand is called with correct parameters', async () => {
      // Arrange
      const realmId = 'update-realm';
      const updateRealmDto = {
        name: 'Updated Name',
        description: 'Updated Description',
      };

      const updatedRealm: Realm = {
        id: realmId,
        ...updateRealmDto,
        owner: mockUser.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const executeSpy = jest.spyOn(commandBus, 'execute').mockResolvedValue(updatedRealm);

      // Act
      await request(app.getHttpServer())
        .patch(`/v1/realms/${realmId}`)
        .send(updateRealmDto)
        .set('Authorization', 'Bearer mock-token')
        .set('Content-Type', 'application/json')
        .expect(200);

      // Assert
      expect(executeSpy).toHaveBeenCalledWith(expect.any(UpdateRealmCommand));
      expect(executeSpy).toHaveBeenCalledTimes(1);
    });

    it('should verify DeleteRealmCommand is called with correct parameters', async () => {
      // Arrange
      const realmId = 'delete-realm';
      const executeSpy = jest.spyOn(commandBus, 'execute').mockResolvedValue(undefined);

      // Act
      await request(app.getHttpServer()).delete(`/v1/realms/${realmId}`).set('Authorization', 'Bearer mock-token').expect(204);

      // Assert
      expect(executeSpy).toHaveBeenCalledWith(expect.any(DeleteRealmCommand));
      expect(executeSpy).toHaveBeenCalledTimes(1);
    });
  });
});

describe('RealmController (e2e)', () => {
  let app: INestApplication;
  let commandBus: CommandBus;
  let queryBus: QueryBus;
  let moduleFixture: TestingModule;

  // Mock data
  const mockUser = {
    id: 'user-123',
    email: 'test@example.com',
    roles: ['admin', 'realm-manager'],
  };

  const mockRealm: Realm = {
    id: 'test-realm',
    name: 'Test Realm',
    description: 'A test realm for unit testing',
    owner: mockUser.id,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  };

  const mockRealmList: Realm[] = [
    mockRealm,
    {
      id: 'fantasy-realm',
      name: 'Fantasy Realm',
      description: 'A magical fantasy world',
      owner: mockUser.id,
      createdAt: new Date('2024-01-02'),
      updatedAt: new Date('2024-01-02'),
    },
  ];

  const mockPage = new Page(mockRealmList, 0, 10, 2);

  beforeEach(async () => {
    const mockCommandBus = {
      execute: jest.fn(),
    };

    const mockQueryBus = {
      execute: jest.fn(),
    };

    // Mock del guard de autenticación
    const mockJwtAuthGuard = {
      canActivate: jest.fn(() => true),
    };

    moduleFixture = await Test.createTestingModule({
      controllers: [RealmController],
      providers: [
        {
          provide: CommandBus,
          useValue: mockCommandBus,
        },
        {
          provide: QueryBus,
          useValue: mockQueryBus,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue(mockJwtAuthGuard)
      .compile();

    app = moduleFixture.createNestApplication();

    // Configurar ValidationPipe
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    );

    // Mock request user
    app.use((req: any, res: any, next: any) => {
      req.user = mockUser;
      next();
    });

    commandBus = moduleFixture.get<CommandBus>(CommandBus);
    queryBus = moduleFixture.get<QueryBus>(QueryBus);

    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('GET /v1/realms/:id', () => {
    it('should return a realm by id', async () => {
      // Arrange
      const realmId = 'test-realm';
      jest.spyOn(queryBus, 'execute').mockResolvedValue(mockRealm);

      // Act & Assert
      return request(app.getHttpServer())
        .get(`/v1/realms/${realmId}`)
        .set('Authorization', 'Bearer mock-token')
        .expect(200)
        .expect((res) => {
          expect(res.body).toEqual({
            id: mockRealm.id,
            name: mockRealm.name,
            description: mockRealm.description,
          });
        });
    });

    it('should return 500 when realm not found', async () => {
      // Arrange
      const realmId = 'non-existent-realm';
      jest.spyOn(queryBus, 'execute').mockRejectedValue(new Error('Realm not found'));

      // Act & Assert
      return request(app.getHttpServer()).get(`/v1/realms/${realmId}`).set('Authorization', 'Bearer mock-token').expect(500);
    });
  });

  describe('GET /v1/realms', () => {
    it('should return paginated realms without query', async () => {
      // Arrange
      jest.spyOn(queryBus, 'execute').mockResolvedValue(mockPage);

      // Act & Assert
      return request(app.getHttpServer())
        .get('/v1/realms')
        .query({ page: 0, size: 10 })
        .set('Authorization', 'Bearer mock-token')
        .expect(200)
        .expect((res) => {
          expect(res.body.content).toHaveLength(2);
          expect(res.body.pagination.totalElements).toBe(2);
          expect(res.body.content[0]).toEqual({
            id: mockRealm.id,
            name: mockRealm.name,
            description: mockRealm.description,
          });
        });
    });

    it('should return paginated realms with RSQL query', async () => {
      // Arrange
      const rsqlQuery = 'name=="Test Realm"';
      const filteredPage = new Page([mockRealm], 0, 10, 1);
      jest.spyOn(queryBus, 'execute').mockResolvedValue(filteredPage);

      // Act & Assert
      return request(app.getHttpServer())
        .get('/v1/realms')
        .query({ q: rsqlQuery, page: 0, size: 10 })
        .set('Authorization', 'Bearer mock-token')
        .expect(200)
        .expect((res) => {
          expect(res.body.content).toHaveLength(1);
          expect(res.body.pagination.totalElements).toBe(1);
        });
    });

    it('should use default pagination values', async () => {
      // Arrange
      jest.spyOn(queryBus, 'execute').mockResolvedValue(mockPage);

      // Act & Assert
      return request(app.getHttpServer()).get('/v1/realms').set('Authorization', 'Bearer mock-token').expect(200);
    });
  });

  describe('POST /v1/realms', () => {
    it('should create a new realm', async () => {
      // Arrange
      const createRealmDto = {
        id: 'new-realm',
        name: 'New Realm',
        description: 'A brand new realm',
      };

      const createdRealm: Realm = {
        id: createRealmDto.id,
        name: createRealmDto.name,
        description: createRealmDto.description,
        owner: mockUser.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(commandBus, 'execute').mockResolvedValue(createdRealm);

      // Act & Assert
      return request(app.getHttpServer())
        .post('/v1/realms')
        .send(createRealmDto)
        .set('Authorization', 'Bearer mock-token')
        .set('Content-Type', 'application/json')
        .expect(201)
        .expect((res) => {
          expect(res.body).toEqual({
            id: createdRealm.id,
            name: createdRealm.name,
            description: createdRealm.description,
          });
        });
    });

    it('should reject invalid realm data', async () => {
      // Arrange
      const invalidRealmDto = {
        // Missing required 'id' field
        name: 'New Realm',
        description: 'A brand new realm',
      };

      // Act & Assert
      return request(app.getHttpServer())
        .post('/v1/realms')
        .send(invalidRealmDto)
        .set('Authorization', 'Bearer mock-token')
        .set('Content-Type', 'application/json')
        .expect(400);
    });

    it('should reject realm with empty id', async () => {
      // Arrange
      const invalidRealmDto = {
        id: '', // Empty id
        name: 'New Realm',
        description: 'A brand new realm',
      };

      // Act & Assert
      return request(app.getHttpServer())
        .post('/v1/realms')
        .send(invalidRealmDto)
        .set('Authorization', 'Bearer mock-token')
        .set('Content-Type', 'application/json')
        .expect(400);
    });

    it('should allow realm creation without description', async () => {
      // Arrange
      const createRealmDto = {
        id: 'minimal-realm',
        name: 'Minimal Realm',
        // No description
      };

      const createdRealm: Realm = {
        id: createRealmDto.id,
        name: createRealmDto.name,
        description: undefined,
        owner: mockUser.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(commandBus, 'execute').mockResolvedValue(createdRealm);

      // Act & Assert
      return request(app.getHttpServer())
        .post('/v1/realms')
        .send(createRealmDto)
        .set('Authorization', 'Bearer mock-token')
        .set('Content-Type', 'application/json')
        .expect(201);
    });
  });

  describe('PATCH /v1/realms/:id', () => {
    it('should update an existing realm', async () => {
      // Arrange
      const realmId = 'test-realm';
      const updateRealmDto = {
        name: 'Updated Realm Name',
        description: 'Updated description',
      };

      const updatedRealm: Realm = {
        id: realmId,
        name: updateRealmDto.name,
        description: updateRealmDto.description,
        owner: mockUser.id,
        createdAt: mockRealm.createdAt,
        updatedAt: new Date(),
      };

      jest.spyOn(commandBus, 'execute').mockResolvedValue(updatedRealm);

      // Act & Assert
      return request(app.getHttpServer())
        .patch(`/v1/realms/${realmId}`)
        .send(updateRealmDto)
        .set('Authorization', 'Bearer mock-token')
        .set('Content-Type', 'application/json')
        .expect(200)
        .expect((res) => {
          expect(res.body).toEqual({
            id: updatedRealm.id,
            name: updatedRealm.name,
            description: updatedRealm.description,
          });
        });
    });

    it('should allow partial updates', async () => {
      // Arrange
      const realmId = 'test-realm';
      const updateRealmDto = {
        name: 'Only Name Updated',
        // No description update
      };

      const updatedRealm: Realm = {
        id: realmId,
        name: updateRealmDto.name,
        description: mockRealm.description,
        owner: mockUser.id,
        createdAt: mockRealm.createdAt,
        updatedAt: new Date(),
      };

      jest.spyOn(commandBus, 'execute').mockResolvedValue(updatedRealm);

      // Act & Assert
      return request(app.getHttpServer())
        .patch(`/v1/realms/${realmId}`)
        .send(updateRealmDto)
        .set('Authorization', 'Bearer mock-token')
        .set('Content-Type', 'application/json')
        .expect(200)
        .expect((res) => {
          expect(res.body.name).toBe(updateRealmDto.name);
        });
    });
  });

  describe('DELETE /v1/realms/:id', () => {
    it('should delete an existing realm', async () => {
      // Arrange
      const realmId = 'test-realm';
      jest.spyOn(commandBus, 'execute').mockResolvedValue(undefined);

      // Act & Assert
      return request(app.getHttpServer()).delete(`/v1/realms/${realmId}`).set('Authorization', 'Bearer mock-token').expect(204);
    });

    it('should handle deletion of non-existent realm', async () => {
      // Arrange
      const realmId = 'non-existent-realm';
      jest.spyOn(commandBus, 'execute').mockRejectedValue(new Error('Realm not found'));

      // Act & Assert
      return request(app.getHttpServer()).delete(`/v1/realms/${realmId}`).set('Authorization', 'Bearer mock-token').expect(500);
    });
  });

  describe('Authentication', () => {
    it('should reject requests without authentication token', async () => {
      // Crear una app sin el mock del usuario
      const testApp = moduleFixture.createNestApplication();
      await testApp.init();

      // Act & Assert
      const result = await request(testApp.getHttpServer()).get('/v1/realms/test-realm').expect(403);

      await testApp.close();
      return result;
    });
  });

  describe('Input Validation', () => {
    it('should validate pagination parameters', async () => {
      // Arrange
      jest.spyOn(queryBus, 'execute').mockResolvedValue(mockPage);

      // Act & Assert - Invalid page number
      return request(app.getHttpServer())
        .get('/v1/realms')
        .query({ page: -1, size: 10 })
        .set('Authorization', 'Bearer mock-token')
        .expect(400);
    });

    it('should validate size parameter limits', async () => {
      // Arrange
      jest.spyOn(queryBus, 'execute').mockResolvedValue(mockPage);

      // Act & Assert - Size too large
      return request(app.getHttpServer())
        .get('/v1/realms')
        .query({ page: 0, size: 1000 })
        .set('Authorization', 'Bearer mock-token')
        .expect(400);
    });
  });
});
