import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // App config
  app.use(cookieParser());
  app.setGlobalPrefix('api');
  app.enableVersioning({ type: VersioningType.URI });

  // .env variable
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 3000;

  // listening the app
  await app.listen(port);
  Logger.log(`Server is running on http://localhost:${port}`);
}
bootstrap();
