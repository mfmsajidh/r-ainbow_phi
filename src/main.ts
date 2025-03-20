import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder, SwaggerCustomOptions } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  app.useGlobalPipes(new ValidationPipe({
    disableErrorMessages: !configService.get<boolean>('application.validationError'),
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  const options: SwaggerCustomOptions = {
    ui: configService.get<boolean>('swagger.ui'),
    raw: configService.get<[]>('swagger.raw')
  }

  const config = new DocumentBuilder()
    .setTitle(configService.get<string>('swagger.title') as string)
    .setDescription(configService.get<string>('swagger.description') as string)
    .setVersion(configService.get<string>('swagger.version') as string)
    .addBearerAuth()
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(configService.get<string>('swagger.url') as string, app, documentFactory, options);

  await app.listen(configService.get('application.port') as number);
  console.log(`Application is running on: ${await app.getUrl()}`);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}

bootstrap();
