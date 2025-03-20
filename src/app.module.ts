import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomersModule } from './customers/customers.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import databaseConfig from '../config/database.config';
import swaggerConfig from '../config/swagger.config';
import applicationConfig from '../config/application.config';
import validationSchema from '../config/validation.config';
import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';

const ENV_PATHS = ['.env.development.local', '.env.test.local', '.env.production.local', '.env.local', '.env'];

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      envFilePath: ENV_PATHS,
      load: [applicationConfig, swaggerConfig],
      validationSchema,
      isGlobal: true,
      cache: true,
    }),
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        ttl: configService.get<number>('application.cacheTtl'),
        max: configService.get<number>('application.cacheSize'),
      }),
      isGlobal: true,
    }),

    TypeOrmModule.forRootAsync(databaseConfig.asProvider()),

    CustomersModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    }
  ],
})
export class AppModule {}
