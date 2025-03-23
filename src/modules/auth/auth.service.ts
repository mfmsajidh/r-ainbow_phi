import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CustomersService } from '../customers/customers.service';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { Customer } from '../customers/entities/customer.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly customersService: CustomersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.customersService.findOne(email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new UnauthorizedException('Invalid credentials');

    const { password: _, ...userWithoutPass } = user;
    return userWithoutPass;
  }

  async login(user: any) {
    const payload = {
      sub: user.id,
      email: user.email,
    };

    const token = this.jwtService.sign(payload);

    return {
      access_token: token,
      user,
    };
  }

  async register(registerDto: RegisterDto): Promise<Customer> {
    return this.customersService.create(registerDto);
  }
}
