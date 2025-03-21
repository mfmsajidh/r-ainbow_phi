import { registerAs } from '@nestjs/config';
import * as process from 'node:process';

export default registerAs('swagger', () => ({
  ui: process.env.SWAGGER_UI === 'true',
  raw: process.env.SWAGGER_RAW ? process.env.SWAGGER_RAW.split(',') : [''],
  title: process.env.SWAGGER_TITLE ?? 'R-ainbow Phi',
  description: process.env.SWAGGER_DESC ?? 'R-ainbow Phi API Documentation',
  version: process.env.SWAGGER_VERSION ?? '1.0.0',
  url: process.env.SWAGGER_URL ?? 'api',
}));
