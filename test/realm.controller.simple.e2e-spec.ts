/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { getModelToken } from '@nestjs/mongoose';
import { JwtAuthGuard } from '../src/modules/auth/jwt.auth.guard';

describe('RealmController (e2e)', () => {
  let app: INestApplication;
  let mockRealmModel: any;

  const mockRealm = {
    _id: '507f1f77bcf86cd799439011',
    id: 'test-realm',
    name: 'Test Realm',
    description: 'A test realm for e2e testing',
    owner: 'test-user-id',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  };

  const mockUser = {
    id: 'test-user-id',
    email: 'test@example.com',
    roles: ['admin'],
  };

  beforeAll(async () => {
    // Create mock model
    mockRealmModel = {
      find: jest.fn().mockReturnValue({
        skip: jest.fn().mockReturnValue({
          limit: jest.fn().mockReturnValue({
            exec: jest.fn().mockResolvedValue([mockRealm]),
          }),
        }),
        exec: jest.fn().mockResolvedValue([mockRealm]),
      }),
      findById: jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockRealm),
      }),
      create: jest.fn().mockResolvedValue(mockRealm),
      updateOne: jest.fn().mockResolvedValue({ modifiedCount: 1 }),
      deleteOne: jest.fn().mockResolvedValue({ deletedCount: 1 }),
      countDocuments: jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(1),
      }),
      aggregate: jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue([
          {
            _id: null,
            count: 1,
            data: [mockRealm],
          },
        ]),
      }),
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(getModelToken('Realm'))
      .useValue(mockRealmModel)
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: jest.fn().mockImplementation((context) => {
          const request = context.switchToHttp().getRequest();
          request.user = mockUser;
          return true;
        }),
      })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('/v1/realms (GET)', () => {
    it('should return paginated realms', async () => {
      const response = await request(app.getHttpServer()).get('/v1/realms').query({ page: 0, size: 10 }).expect(200);

      expect(response.body).toHaveProperty('content');
      expect(response.body).toHaveProperty('pagination');
      expect(Array.isArray(response.body.content)).toBe(true);
    });

    it('should handle RSQL query parameter', async () => {
      const response = await request(app.getHttpServer())
        .get('/v1/realms')
        .query({
          q: 'name=="Test Realm"',
          page: 0,
          size: 10,
        })
        .expect(200);

      expect(response.body).toHaveProperty('content');
      expect(response.body).toHaveProperty('pagination');
    });
  });

  describe('/v1/realms/:id (GET)', () => {
    it('should return realm by id', async () => {
      const response = await request(app.getHttpServer()).get('/v1/realms/test-realm').expect(200);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('name');
      expect(response.body.name).toBe('Test Realm');
    });
  });

  describe('/v1/realms (POST)', () => {
    const createRealmDto = {
      id: 'new-test-realm',
      name: 'New Test Realm',
      description: 'A new test realm for creation testing',
    };

    it('should create a new realm with valid data', async () => {
      const createdRealm = {
        ...createRealmDto,
        _id: '507f1f77bcf86cd799439012',
        owner: mockUser.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRealmModel.create.mockResolvedValue(createdRealm);

      const response = await request(app.getHttpServer()).post('/v1/realms').send(createRealmDto).expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('name');
      expect(response.body.name).toBe(createRealmDto.name);
    });

    it('should return 400 with invalid data', async () => {
      const invalidDto = {
        name: '', // Invalid: empty name
        description: 'Invalid realm',
      };

      await request(app.getHttpServer()).post('/v1/realms').send(invalidDto).expect(400);
    });
  });

  describe('/v1/realms/:id (PATCH)', () => {
    const updateRealmDto = {
      name: 'Updated Test Realm',
      description: 'Updated description',
    };

    it('should update an existing realm', async () => {
      const updatedRealm = {
        ...mockRealm,
        ...updateRealmDto,
        updatedAt: new Date(),
      };

      mockRealmModel.findById.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValue(updatedRealm),
      });

      const response = await request(app.getHttpServer()).patch('/v1/realms/test-realm').send(updateRealmDto).expect(200);

      expect(response.body).toHaveProperty('name');
    });
  });

  describe('/v1/realms/:id (DELETE)', () => {
    it('should delete an existing realm', async () => {
      await request(app.getHttpServer()).delete('/v1/realms/test-realm').expect(204);
    });
  });
});
