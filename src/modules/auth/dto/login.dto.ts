import { PickType } from '@nestjs/swagger';
import { CreateCustomerDto } from '../../customers/dto/create-customer.dto';

export class LoginDto extends PickType(CreateCustomerDto, [
  'email',
  'password',
] as const) {}
