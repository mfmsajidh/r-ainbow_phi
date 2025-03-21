import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as request from 'supertest';
import { CustomersModule } from '../../src/modules/customers/customers.module';
import { CreateCustomerDto } from '../../src/modules/customers/dto/create-customer.dto';

describe('Customers - /customers (e2e)', () => {
  const customers = {
    id: 1,
    firstName: 'FirstName #1',
    lastName: 'LastName #1',
    isActive: true,
    password: 'string2A!',
  };

  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: '127.0.0.1',
          port: 3307,
          username: 'root',
          password: 'root',
          database: 'test',
          autoLoadEntities: true,
          synchronize: true,
        }),
        CustomersModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('Create [POST /customers]', async () => {
    return request(app.getHttpServer())
      .post('/customers')
      .send(customers as CreateCustomerDto)
      .expect(201)
      .then(({ body }) => {
        expect(body).toEqual(customers);
      });
  });

  it('Get all customers [GET /customers]', async () => {
    return request(app.getHttpServer())
      .get('/customers')
      .expect(200)
      .then(({ body }) => {
        expect(body).toBeDefined();
      });
  });

  it('Get one customer [GET /customers/:id]', async () => {
    return request(app.getHttpServer())
      .get('/customers/2')
      .expect(200)
      .then(({ body }) => {
        expect(body).toBeDefined();
      });
  });

  it('Delete one customer [DELETE /customers/:id]', () => {
    return request(app.getHttpServer()).delete('/customers/1').expect(200);
  });

  afterAll(async () => {
    await app.close();
  });
});
