import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerCustomOptions, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ConsoleLogger, Logger, LogLevel, ValidationPipe, VersioningType } from '@nestjs/common';
import * as compression from 'compression';
import helmet from 'helmet';

declare const module: NodeJS.Module & {
  hot?: {
    accept(callback?: () => void): void;
    dispose(callback: () => void): void;
  };
};

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  const app = await NestFactory.create(AppModule);

  app.use(helmet());
  // TODO: Offload compression to NGINX in production environments
  app.use(compression());

  const configService = app.get(ConfigService);
  const logLevels = configService.get<LogLevel[]>('application.logLevels') || [
    'log',
    'warn',
    'error',
  ];

  app.useLogger(
    new ConsoleLogger({
      prefix: configService.get<string>('swagger.title') as string,
      logLevels,
    }),
  );

  const globalPrefix = 'v1';
  app.setGlobalPrefix(globalPrefix);
  app.enableVersioning({
    type: VersioningType.URI,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      disableErrorMessages: !configService.get<boolean>('application.validationError'),
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const options: SwaggerCustomOptions = {
    ui: configService.get<boolean>('swagger.ui'),
    raw: configService.get<[]>('swagger.raw'),
  };

  const swaggerConfig = new DocumentBuilder()
    .setTitle(configService.get<string>('swagger.title') as string)
    .setDescription(configService.get<string>('swagger.description') as string)
    .setVersion(configService.get<string>('swagger.version') as string)
    .addBearerAuth()
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup(
    `${globalPrefix}/${configService.get<string>('swagger.url') as string}`,
    app,
    documentFactory,
    options,
  );

  app.enableCors();

  /**
   * TODO: Configure and setup CSRF properly
   */
  // app.use(cookieParser());
  // app.use(new CsrfMiddleware().use);

  await app.listen(configService.get<number>('application.port') as number);
  logger.log(`🚀 Application is running on: ${await app.getUrl()}`);

  if (module.hot) {
    module.hot.accept(() => {});
    module.hot.dispose(() => {
      void app.close();
    });
  }
}

bootstrap().catch((error) => {
  console.error('Bootstrap failed', error);
  process.exit(1);
});
