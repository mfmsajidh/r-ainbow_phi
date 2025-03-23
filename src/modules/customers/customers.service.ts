import { Injectable } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Customer } from './entities/customer.entity';
import { Repository, UpdateResult } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from '../auth/dto/register.dto';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private customersRepository: Repository<Customer>,
  ) {}

  async create(createCustomerDto: CreateCustomerDto | RegisterDto): Promise<Customer> {
    const customer = this.customersRepository.create(createCustomerDto);
    customer.password = await bcrypt.hash(createCustomerDto.password, 10);
    return this.customersRepository.save(customer);
  }

  findAll(): Promise<Customer[]> {
    return this.customersRepository.find();
  }

  findOne(email: string): Promise<Customer | null> {
    return this.customersRepository.findOneBy({ email });
  }

  async update(
    id: number,
    updateCustomerDto: UpdateCustomerDto,
  ): Promise<UpdateResult> {
    return this.customersRepository.update(id, updateCustomerDto);
  }

  async remove(id: number): Promise<void> {
    await this.customersRepository.delete(id);
  }
}
