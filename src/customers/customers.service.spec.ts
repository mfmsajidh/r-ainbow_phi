import { Test, TestingModule } from '@nestjs/testing';
import { CustomersService } from './customers.service';
import { Repository } from 'typeorm';
import { Customer } from './entities/customer.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

const customerArray = [
  {
    firstName: 'firstName #1',
    lastName: 'lastName #1',
  },
  {
    firstName: 'firstName #2',
    lastName: 'lastName #2',
  },
];

const oneCustomer = {
  firstName: 'firstName #1',
  lastName: 'lastName #1',
};

describe('CustomersService', () => {
  let service: CustomersService;
  let repository: Repository<Customer>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomersService,
        {
          provide: getRepositoryToken(Customer),
          useValue: {
            find: jest.fn().mockResolvedValue(customerArray),
            findOneBy: jest.fn().mockResolvedValue(oneCustomer),
            save: jest.fn().mockResolvedValue(oneCustomer),
            remove: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CustomersService>(CustomersService);
    repository = module.get<Repository<Customer>>(getRepositoryToken(Customer));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create()', () => {
    it('should successfully insert a customer', () => {
      const oneCustomer = {
        firstName: 'firstName #1',
        lastName: 'lastName #1',
      };

      expect(
        service.create({
          firstName: 'firstName #1',
          lastName: 'lastName #1',
        }),
      ).resolves.toEqual(oneCustomer);
    });
  });

  describe('findAll()', () => {
    it('should return an array of customers', async () => {
      const customers = await service.findAll();
      expect(customers).toEqual(customerArray);
    });
  });

  describe('findOne()', () => {
    it('should get a single customer', () => {
      const repoSpy = jest.spyOn(repository, 'findOneBy');
      expect(service.findOne(1)).resolves.toEqual(oneCustomer);
      expect(repoSpy).toHaveBeenCalledWith({ id: 1 });
    });
  });

  describe('remove()', () => {
    it('should call remove with the passed value', async () => {
      const removeSpy = jest.spyOn(repository, 'delete');
      const retVal = await service.remove(2);
      expect(removeSpy).toHaveBeenCalledWith(2);
      expect(retVal).toBeUndefined();
    });
  });
});
