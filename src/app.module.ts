import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomersModule } from './modules/customers/customers.module';
import { ConditionalModule, ConfigModule, ConfigService } from '@nestjs/config';
import databaseConfig from './config/database.config';
import swaggerConfig from './config/swagger.config';
import applicationConfig from './config/application.config';
import validationSchema from './config/validation.config';
import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { BullModule } from '@nestjs/bullmq';
import bullConfig from './config/bull.config';
import { AuthModule } from './modules/auth/auth.module';
import { ProductsModule } from './modules/products/products.module';
import { CampaignModule } from './modules/campaign/campaign.module';
import { MailModule } from './modules/mail/mail.module';
import { JobsModule } from './modules/jobs/jobs.module';
import { SeedModule } from './modules/seeds/seed.module';
import emailConfig from './config/email.config';

const ENV_PATHS = [
  '.env.development.local',
  '.env.test.local',
  '.env.production.local',
  '.env.local',
  '.env',
];

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ENV_PATHS,
      load: [applicationConfig, swaggerConfig, bullConfig, emailConfig],
      validationSchema,
      isGlobal: true,
      cache: true,
    }),
    CacheModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        ttl: configService.get<number>('application.cacheTtl'),
        max: configService.get<number>('application.cacheSize'),
      }),
      isGlobal: true,
      inject: [ConfigService],
    }),
    BullModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        connection: {
          host: configService.get<string>('bull.host'),
          port: configService.get<number>('bull.port'),
        },
      }),
      inject: [ConfigService],
    }),

    TypeOrmModule.forRootAsync(databaseConfig.asProvider()),

    ConditionalModule.registerWhen(
      SeedModule,
      (env: NodeJS.ProcessEnv) => env['RUN_SEED'] === 'true',
    ),

    CustomersModule,
    AuthModule,
    ProductsModule,
    CampaignModule,
    MailModule,
    JobsModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
  ],
})
export class AppModule {}
