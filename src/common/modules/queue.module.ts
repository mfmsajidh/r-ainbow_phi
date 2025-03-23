import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';

@Module({
  imports: [
    BullModule.registerQueue({ name: 'birthday-emails' }),
  ],
  exports: [
    BullModule,
  ],
})
export class QueueModule {}
