import * as Joi from 'joi';

export default Joi.object({
  // Application
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test', 'provision')
    .default('development'),
  PORT: Joi.number().port().default(3000),
  VALIDATION_ERROR: Joi.boolean().default(false),
  CACHE_TTL: Joi.number().default(300000), // 5 min
  CACHE_MAX: Joi.number().default(100),
  LOG_LEVELS: Joi.string().default('log,warn,error'),

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
  SWAGGER_RAW: Joi.string().default('json'),
  SWAGGER_TITLE: Joi.string().default('R-ainbow Phi'),
  SWAGGER_DESC: Joi.string().default('R-ainbow Phi API Documentation'),
  SWAGGER_VERSION: Joi.string().default('1.0.0'),
  SWAGGER_URL: Joi.string().default('api'),

  // Bull
  BULL_HOST: Joi.string().required(),
  BULL_PORT: Joi.number().required(),

});
