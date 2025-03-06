import { NestFactory } from '@nestjs/core';
import { config } from 'dotenv';
import { PowerserveModule } from './powerserve.module';
import { WinstonLoggerService } from './__logger__/winston-logger.service';

async function bootstrap() {

  try {
    config();
  } catch (error) {
    console.error('Error loading .env file', error);
    process.exit(1);
  }

  const app = await NestFactory.create(PowerserveModule);

  const logger = new WinstonLoggerService();
  app.useLogger(logger);
  
  app.setGlobalPrefix('/lvis/powerserve-api');
  app.enableCors();

  const port = process.env.POWERSERVE_PORT || 4003;

  await app.listen(port, '127.0.0.1', async () => {
    console.log(`Running API in NODE ${process.env.NODE_ENV} on ${await app.getUrl()}`);
  });

}

bootstrap();
