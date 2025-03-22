import { Test, TestingModule } from '@nestjs/testing';
import { CustomersController } from './customers.controller';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';

const createCustomerDto: CreateCustomerDto = {
  firstName: 'firstName #1',
  lastName: 'lastName #1',
  password: 'string2A!',
};

describe('CustomersController', () => {
  let customersController: CustomersController;
  let customersService: CustomersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CustomersController],
      providers: [
        CustomersService,
        {
          provide: CustomersService,
          useValue: {
            create: jest
              .fn()
              .mockImplementation((customer: CreateCustomerDto) =>
                Promise.resolve({ id: '1', ...customer }),
              ),
            findAll: jest.fn().mockResolvedValue([
              {
                firstName: 'firstName #1',
                lastName: 'lastName #1',
              },
              {
                firstName: 'firstName #2',
                lastName: 'lastName #2',
              },
            ]),
            findOne: jest.fn().mockImplementation((id: string) =>
              Promise.resolve({
                firstName: 'firstName #1',
                lastName: 'lastName #1',
                id,
              }),
            ),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    customersController = module.get<CustomersController>(CustomersController);
    customersService = module.get<CustomersService>(CustomersService);
  });

  it('should be defined', () => {
    expect(customersController).toBeDefined();
  });

  describe('create()', () => {
    it('should create a customer', () => {
      customersController.create(createCustomerDto);
      expect(customersController.create(createCustomerDto)).resolves.toEqual({
        id: '1',
        ...createCustomerDto,
      });
      expect(customersService.create).toHaveBeenCalledWith(createCustomerDto);
    });
  });

  describe('findAll()', () => {
    it('should find all customers ', () => {
      customersController.findAll();
      expect(customersService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne()', () => {
    it('should find a customer', () => {
      expect(customersController.findOne('1')).resolves.toEqual({
        firstName: 'firstName #1',
        lastName: 'lastName #1',
        id: 1,
      });
      expect(customersService.findOne).toHaveBeenCalled();
    });
  });

  describe('remove()', () => {
    it('should remove the customer', () => {
      customersController.remove(2);
      expect(customersService.remove).toHaveBeenCalled();
    });
  });
});
