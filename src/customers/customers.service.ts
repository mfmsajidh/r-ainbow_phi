import { Injectable } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Customer } from './entities/customer.entity';
import { Repository, UpdateResult } from 'typeorm';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private customersRepository: Repository<Customer>,
  ) {
  }

  create(createCustomerDto: CreateCustomerDto): Promise<Customer> {
    const customer = new Customer();
    customer.firstName = createCustomerDto.firstName;
    customer.lastName = createCustomerDto.lastName;

    return this.customersRepository.save(customer);
  }

  findAll(): Promise<Customer[]> {
    return this.customersRepository.find();
  }

  findOne(id: number): Promise<Customer | null> {
    return this.customersRepository.findOneBy({ id });
  }

  async update(id: number, updateCustomerDto: UpdateCustomerDto): Promise<UpdateResult> {
    return this.customersRepository.update(id, updateCustomerDto);
  }

  async remove(id: number): Promise<void> {
    await this.customersRepository.delete(id);
  }
}
