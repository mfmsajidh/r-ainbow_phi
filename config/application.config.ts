import { registerAs } from '@nestjs/config';
import * as process from 'node:process';

export default registerAs('application', () => ({
  port: parseInt(process.env.PORT ?? '3000', 10)
}));
