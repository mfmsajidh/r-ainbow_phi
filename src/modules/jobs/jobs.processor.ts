import { Job } from 'bullmq';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { CampaignService } from '../campaign/campaign.service';

@Processor('birthday')
export class JobsProcessor extends WorkerHost {
  constructor(private readonly campaignService: CampaignService) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<void> {
    await this.campaignService.runBirthdayCampaign();
  }
}
