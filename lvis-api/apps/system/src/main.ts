import { NestFactory } from '@nestjs/core';
import { SystemModule } from './system.module';
import { config } from 'dotenv';
import { WinstonLoggerService } from './__logger__/winston-logger.service';


async function bootstrap() {

  try {
    config();
  } catch (error) {
    console.error('Error loading .env file', error);
    process.exit(1);
  }

  const app = await NestFactory.create(SystemModule);
  const winstonLogger = app.get(WinstonLoggerService);
  app.useLogger(winstonLogger);

  app.setGlobalPrefix('/lvis/system-api');

  app.enableCors();

  const port = process.env.SYSTEM_PORT || 3000;

  // await app.listen(port, async () => {
  //   console.log(`Running API in NODE ${process.env.NODE_ENV} on ${await app.getUrl()}`);
  //   process.send && process.send('ready'); // Send ready signal to PM2
  // });

  await app.listen(port, '0.0.0.0', async () => {
    console.log(`Running API in NODE ${process.env.NODE_ENV} on ${await app.getUrl()}`);
    process.send && process.send('ready'); // Send ready signal to PM2
  });

}

bootstrap();
