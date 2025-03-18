import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomersModule } from './customers/customers.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'root',
      database: 'r-ainbow_phi',
      synchronize: true, //TODO Comment in production
      logging: true, //TODO Comment in production
      autoLoadEntities: true,
    }),
    CustomersModule,
  ],
})
export class AppModule {}
