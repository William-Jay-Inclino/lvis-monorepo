import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from 'dotenv';
import { WinstonLoggerService } from './__logger__/winston-logger.service';

async function bootstrap() {

  try {
    config();
  } catch (error) {
    console.error('Error loading .env file');
    console.error(error);
    process.exit(1);
  }

  const app = await NestFactory.create(AppModule);
  const winstonLogger = app.get(WinstonLoggerService);
  app.useLogger(winstonLogger);
  
  app.setGlobalPrefix('/lvis/api');

  app.enableCors();

  const port = process.env.API_GATEWAY_PORT || 3000;

  await app.listen(port, async () => {
    console.log(`Running API in NODE ${process.env.NODE_ENV} on ${await app.getUrl()}`);
  });
}

bootstrap();
