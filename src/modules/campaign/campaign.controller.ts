import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { CampaignService } from './campaign.service';
import { AuthenticatedRequest } from '../../common/interfaces/authenticated-request.interface';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('campaign')
export class CampaignController {
  constructor(private readonly campaignService: CampaignService) {}

  /**
   * Get personalised birthday campaign content
   * @param req
   */
  @Get('in-app')
  async getBirthdayContent(@Req() req: AuthenticatedRequest) {
    return this.campaignService.getBirthdayCampaignContent(req.user.email);
  }
}
