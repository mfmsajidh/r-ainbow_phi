import { registerAs } from '@nestjs/config';
import * as process from 'node:process';

export default registerAs('security', () => ({
  secret: process.env.JWT_SECRET,
  expiry: process.env.JWT_EXPIRY,
}));
