import { registerAs } from '@nestjs/config';
import * as process from 'node:process';

export default registerAs('email', () => ({
  user: process.env.EMAIL_USER,
  password: process.env.EMAIL_PASS,
}));
