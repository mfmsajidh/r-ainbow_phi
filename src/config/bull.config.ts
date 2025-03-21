import { registerAs } from '@nestjs/config';
import * as process from 'node:process';

export default registerAs('bull', () => ({
  host: process.env.BULL_HOST,
  port: parseInt(process.env.BULL_PORT as string, 10),
}));
