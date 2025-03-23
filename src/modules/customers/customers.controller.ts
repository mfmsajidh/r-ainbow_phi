import {
  Controller,
  Get,
  Body,
  Patch,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CustomersService } from './customers.service';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { Customer } from './entities/customer.entity';
import { UpdateResult } from 'typeorm';
import { CacheTTL } from '@nestjs/cache-manager';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  /**
   * Get details of the currently authenticated customer.
   */
  @Get('me')
  @CacheTTL(30000) // Cache response for 30 seconds
  getProfile(@Request() req): Promise<Customer | null> {
    return this.customersService.findOne(req.user.email);
  }

  /**
   * Update the currently authenticated customer's details.
   */
  @Patch('me')
  updateProfile(
    @Request() req,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ): Promise<UpdateResult> {
    return this.customersService.update(req.user.id, updateCustomerDto);
  }

  /**
   * Delete the currently authenticated customer's account.
   */
  @Delete('me')
  removeProfile(@Request() req): Promise<void> {
    return this.customersService.remove(req.user.id);
  }
}
