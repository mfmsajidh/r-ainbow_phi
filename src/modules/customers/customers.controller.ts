import { Controller, Get, Body, Patch, Delete, UseGuards, Req } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CustomersService } from './customers.service';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { Customer } from './entities/customer.entity';
import { UpdateResult } from 'typeorm';
import { CacheTTL } from '@nestjs/cache-manager';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { AuthenticatedRequest } from '../../common/interfaces/authenticated-request.interface';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  /**
   * Get current customer details
   */
  @Get('me')
  @CacheTTL(30000) // Cache response for 30 seconds
  getProfile(@Req() req: AuthenticatedRequest): Promise<Customer | null> {
    return this.customersService.findOne(req.user.email);
  }

  /**
   * Update current customer details
   */
  @Patch('me')
  updateProfile(
    @Req() req: AuthenticatedRequest,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ): Promise<UpdateResult> {
    return this.customersService.update(req.user.id, updateCustomerDto);
  }

  /**
   * Delete current customer account
   */
  @Delete('me')
  removeProfile(@Req() req: AuthenticatedRequest): Promise<void> {
    return this.customersService.remove(req.user.id);
  }
}
