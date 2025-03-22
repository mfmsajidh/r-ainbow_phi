import { registerAs } from '@nestjs/config';
import * as process from 'node:process';
import { LogLevel } from '@nestjs/common';

export default registerAs('application', () => ({
  port: parseInt(process.env.PORT ?? '3000', 10),
  validationError: process.env.VALIDATION_ERROR === 'true',
  cacheTtl: parseInt(process.env.CACHE_TTL ?? '300000', 10), // Defaults to 5 minutes
  cacheSize: parseInt(process.env.CACHE_MAX ?? '100', 10),
  logLevels: process.env.LOG_LEVELS
    ? (process.env.LOG_LEVELS.split(',') as LogLevel[])
    : ['log', 'warn', 'error'],
}));
