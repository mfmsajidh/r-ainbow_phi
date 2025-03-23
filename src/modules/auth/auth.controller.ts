import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local.guard';
import { Customer } from '../customers/entities/customer.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Request } from 'express';
import { ApiBody } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Register new customer
   *
   * @param registerDto
   */
  @Post('register')
  async register(@Body() registerDto: RegisterDto): Promise<Customer> {
    return this.authService.register(registerDto);
  }

  /**
   * Login with email/password
   *
   * @param req
   */
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiBody({ type: LoginDto })
  login(@Req() req: Request & { user: Customer }) {
    return this.authService.login(req.user);
  }
}
