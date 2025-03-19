import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomersModule } from './customers/customers.module';
import { ConfigModule } from '@nestjs/config';
import databaseConfig from '../config/database.config';
import swaggerConfig from '../config/swagger.config';
import applicationConfig from '../config/application.config';
import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.development.local', '.env.test.local', '.env.production.local', '.env.local', '.env'],
      load: [applicationConfig, swaggerConfig],
      validationSchema: Joi.object({
        // Application
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test', 'provision')
          .default('development'),
        PORT: Joi.number().port().default(3000),

        // Database
        DATABASE_TYPE: Joi.string().valid('postgres', 'mysql').required(),
        DATABASE_HOST: Joi.string().required(),
        DATABASE_PORT: Joi.number().default(5432),
        DATABASE_USERNAME: Joi.string().required(),
        DATABASE_PASSWORD: Joi.string().required(),
        DATABASE_NAME: Joi.string().required(),
        DATABASE_SYNC: Joi.boolean().default(false),
        DATABASE_LOG: Joi.boolean().default(false),

        // Swagger
        SWAGGER_UI: Joi.boolean().default(false),
        SWAGGER_RAW: Joi.string().default(''),
        SWAGGER_TITLE: Joi.string().default('R-ainbow Phi'),
        SWAGGER_DESC: Joi.string().default('R-ainbow Phi API Documentation'),
        SWAGGER_VERSION: Joi.string().default('1.0.0'),
        SWAGGER_URL: Joi.string().default('api'),
      }),
      validationOptions: {
        allowUnknown: false,
        abortEarly: false,
      },
      isGlobal: true,
      cache: true,
    }),
    TypeOrmModule.forRootAsync(databaseConfig.asProvider()),
    CustomersModule,
  ],
})
export class AppModule {}
