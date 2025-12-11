import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/database/prisma.service';
import { UserRole, UserStatus } from '@prisma/client';

describe('Users API (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let authToken: string;
  let testTenantId: string;
  let testUserId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    // Apply same pipes as main app
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
      }),
    );

    await app.init();

    prisma = app.get<PrismaService>(PrismaService);

    // Setup test data
    const tenant = await prisma.tenant.create({
      data: {
        name: 'Test Tenant',
        slug: 'test-tenant-' + Date.now(),
      },
    });
    testTenantId = tenant.id;

    // Create admin user and get token
    const adminUser = await prisma.user.create({
      data: {
        email: `admin-${Date.now()}@test.com`,
        firstName: 'Admin',
        lastName: 'User',
        password: '$2b$10$hashedpassword', // Pre-hashed password
        role: UserRole.admin,
        status: UserStatus.active,
        tenantId: testTenantId,
      },
    });
    testUserId = adminUser.id;

    // Mock auth token (in real tests, you would login)
    authToken = 'test-jwt-token';
  });

  afterAll(async () => {
    // Cleanup test data
    await prisma.user.deleteMany({
      where: { tenantId: testTenantId },
    });
    await prisma.tenant.delete({
      where: { id: testTenantId },
    });

    await app.close();
  });

  describe('/api/v1/users (GET)', () => {
    it('should return 401 without auth token', () => {
      return request(app.getHttpServer())
        .get('/api/v1/users')
        .expect(401);
    });

    it('should return paginated users with auth', () => {
      return request(app.getHttpServer())
        .get('/api/v1/users')
        .set('Authorization', `Bearer ${authToken}`)
        .set('X-Tenant-ID', testTenantId)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('data');
          expect(res.body).toHaveProperty('meta');
          expect(Array.isArray(res.body.data)).toBe(true);
        });
    });

    it('should filter users by status', () => {
      return request(app.getHttpServer())
        .get('/api/v1/users?status=active')
        .set('Authorization', `Bearer ${authToken}`)
        .set('X-Tenant-ID', testTenantId)
        .expect(200)
        .expect((res) => {
          res.body.data.forEach((user: any) => {
            expect(user.status).toBe('active');
          });
        });
    });

    it('should search users by name', () => {
      return request(app.getHttpServer())
        .get('/api/v1/users?search=Admin')
        .set('Authorization', `Bearer ${authToken}`)
        .set('X-Tenant-ID', testTenantId)
        .expect(200);
    });
  });

  describe('/api/v1/users/:id (GET)', () => {
    it('should return a user by id', () => {
      return request(app.getHttpServer())
        .get(`/api/v1/users/${testUserId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .set('X-Tenant-ID', testTenantId)
        .expect(200)
        .expect((res) => {
          expect(res.body.data.id).toBe(testUserId);
        });
    });

    it('should return 404 for non-existent user', () => {
      return request(app.getHttpServer())
        .get('/api/v1/users/non-existent-id')
        .set('Authorization', `Bearer ${authToken}`)
        .set('X-Tenant-ID', testTenantId)
        .expect(404);
    });
  });

  describe('/api/v1/users (POST)', () => {
    it('should create a new user', () => {
      const newUser = {
        email: `newuser-${Date.now()}@test.com`,
        firstName: 'New',
        lastName: 'User',
        password: 'Password123!',
        role: 'student',
      };

      return request(app.getHttpServer())
        .post('/api/v1/users')
        .set('Authorization', `Bearer ${authToken}`)
        .set('X-Tenant-ID', testTenantId)
        .send(newUser)
        .expect(201)
        .expect((res) => {
          expect(res.body.data.email).toBe(newUser.email);
          expect(res.body.data.firstName).toBe(newUser.firstName);
        });
    });

    it('should return 400 for invalid data', () => {
      const invalidUser = {
        email: 'invalid-email',
        firstName: '',
      };

      return request(app.getHttpServer())
        .post('/api/v1/users')
        .set('Authorization', `Bearer ${authToken}`)
        .set('X-Tenant-ID', testTenantId)
        .send(invalidUser)
        .expect(400);
    });

    it('should return 409 for duplicate email', async () => {
      const existingUser = {
        email: `duplicate-${Date.now()}@test.com`,
        firstName: 'Duplicate',
        lastName: 'User',
        password: 'Password123!',
        role: 'student',
      };

      // Create first user
      await request(app.getHttpServer())
        .post('/api/v1/users')
        .set('Authorization', `Bearer ${authToken}`)
        .set('X-Tenant-ID', testTenantId)
        .send(existingUser);

      // Try to create duplicate
      return request(app.getHttpServer())
        .post('/api/v1/users')
        .set('Authorization', `Bearer ${authToken}`)
        .set('X-Tenant-ID', testTenantId)
        .send(existingUser)
        .expect(409);
    });
  });

  describe('/api/v1/users/:id (PUT)', () => {
    it('should update a user', () => {
      const updateData = {
        firstName: 'Updated',
        lastName: 'Name',
      };

      return request(app.getHttpServer())
        .put(`/api/v1/users/${testUserId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .set('X-Tenant-ID', testTenantId)
        .send(updateData)
        .expect(200)
        .expect((res) => {
          expect(res.body.data.firstName).toBe(updateData.firstName);
        });
    });
  });

  describe('/api/v1/users/:id/status (PATCH)', () => {
    it('should update user status', () => {
      return request(app.getHttpServer())
        .patch(`/api/v1/users/${testUserId}/status`)
        .set('Authorization', `Bearer ${authToken}`)
        .set('X-Tenant-ID', testTenantId)
        .send({ status: 'suspended' })
        .expect(200)
        .expect((res) => {
          expect(res.body.data.status).toBe('suspended');
        });
    });
  });

  describe('/api/v1/users/:id (DELETE)', () => {
    let userToDelete: string;

    beforeAll(async () => {
      const user = await prisma.user.create({
        data: {
          email: `delete-${Date.now()}@test.com`,
          firstName: 'Delete',
          lastName: 'Me',
          role: UserRole.student,
          status: UserStatus.active,
          tenantId: testTenantId,
        },
      });
      userToDelete = user.id;
    });

    it('should soft delete a user', () => {
      return request(app.getHttpServer())
        .delete(`/api/v1/users/${userToDelete}`)
        .set('Authorization', `Bearer ${authToken}`)
        .set('X-Tenant-ID', testTenantId)
        .expect(200);
    });
  });
});
