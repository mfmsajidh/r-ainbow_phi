import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomersModule } from './customers/customers.module';
import { ConfigModule } from '@nestjs/config';
import databaseConfig from '../config/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.development', '.env.testing', '.env.staging', '.env.production', '.env'],
      isGlobal: true,
      cache: true,
    }),
    TypeOrmModule.forRootAsync(databaseConfig.asProvider()),
    CustomersModule,
  ],
})
export class AppModule {}
