import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local.guard';
import { Customer } from '../customers/entities/customer.entity';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  /**
   * Register new user
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
  async login(@Request() req) {
    return this.authService.login(req.user);
  }
}
