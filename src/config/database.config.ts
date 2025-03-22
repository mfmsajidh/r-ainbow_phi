import { registerAs } from '@nestjs/config';
import * as process from 'node:process';

type DatabaseType = 'postgres';

export default registerAs('database', () => ({
  type: (process.env.DATABASE_TYPE as DatabaseType) ?? 'postgres',
  host: process.env.DATABASE_HOST ?? 'localhost',
  port: parseInt(process.env.DATABASE_PORT ?? '5432', 10),
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  synchronize: (process.env.DATABASE_SYNC ?? 'false') === 'true',
  logging: (process.env.DATABASE_LOG ?? 'false') === 'true',
  autoLoadEntities: true,
}));
