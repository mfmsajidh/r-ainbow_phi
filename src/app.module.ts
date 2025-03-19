import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomersModule } from './customers/customers.module';
import { ConfigModule } from '@nestjs/config';
import databaseConfig from '../config/database.config';
import swaggerConfig from '../config/swagger.config';
import applicationConfig from '../config/application.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.development.local', '.env.test.local', '.env.production.local', '.env.local', '.env'],
      load: [applicationConfig, swaggerConfig],
      isGlobal: true,
      cache: true,
    }),
    TypeOrmModule.forRootAsync(databaseConfig.asProvider()),
    CustomersModule,
  ],
})
export class AppModule {}
