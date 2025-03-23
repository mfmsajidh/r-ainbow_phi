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

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('campaign')
export class CampaignController {
  constructor(
    private readonly customersService: CustomersService,
    private readonly productService: ProductsService,
  ) {}

  /**
   * Get in-app birthday campaign content
   * @param req
   */
  @Get('in-app')
  async getBirthdayContent(@Request() req) {
    const customer = await this.customersService.findOne(req.user.email);

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    const today = new Date();
    const bday = new Date(customer.birthday);
    bday.setFullYear(today.getFullYear());

    const diff = Math.abs(
      Math.floor((bday.getTime() - today.getTime()) / (1000 * 3600 * 24)),
    );

    if (diff <= 3) {
      const products = await this.productService.getSuggestedProducts(
        customer.preferences,
      );
      return { products };
    }

    return { message: 'No campaign currently active.' };
  }
}
