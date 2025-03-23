import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CustomersService } from '../customers/customers.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private customersService: CustomersService) {}

  async validateUser(email: string, password: string) {
    const user = await this.customersService.findOne(email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new UnauthorizedException('Invalid credentials');

    const { password: _, ...userWithoutPass } = user;
    return userWithoutPass;
  }

  async login(user: any) {
    // later you can add JWT here
    return {
      message: 'Logged in successfully',
      user,
    };
  }

  async register(data: any) {
    return this.customersService.create(data);
  }
}
