import {
  Controller,
  Get,
  NotFoundException,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CustomersService } from '../customers/customers.service';
import { ProductsService } from '../products/products.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { differenceInCalendarDays, setYear } from 'date-fns';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('campaign')
export class CampaignController {
  constructor(
    private readonly customersService: CustomersService,
    private readonly productService: ProductsService,
  ) {}

  /**
   * Get personalised birthday campaign content
   * @param req
   */
  @Get('in-app')
  async getBirthdayContent(@Request() req) {
    const customer = await this.customersService.findOne(req.user.email);

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    const today = new Date();
    const birthdayThisYear = setYear(new Date(customer.birthday), today.getFullYear());
    const diff = Math.abs(differenceInCalendarDays(birthdayThisYear, today));

    if (diff === 7) {
      const products = await this.productService.getSuggestedProducts(
        customer.preferences,
      );
      return { products };
    }

    return { message: 'No campaign currently active.' };
  }
}
