import { NestFactory } from '@nestjs/core';
import { config } from 'dotenv';
import { WarehouseModule } from './warehouse.module';
import { WinstonLoggerService } from './__logger__/winston-logger.service';

async function bootstrap() {

  try {
    config();
  } catch (error) {
    console.error('Error loading .env file', error);
    process.exit(1);
  }

  const app = await NestFactory.create(WarehouseModule);
  const winstonLogger = app.get(WinstonLoggerService);
  
  app.useLogger(winstonLogger);
  app.setGlobalPrefix('/lvis/warehouse-api');
  app.enableCors();

  const port = process.env.WAREHOUSE_PORT || 4002;

  // await app.listen(port, async () => {
  //   console.log(`Running API in NODE ${process.env.NODE_ENV} on ${await app.getUrl()}`);
  //   process.send && process.send('ready'); // Send ready signal to PM2
  // });

  await app.listen(port, '127.0.0.1', async () => {
    console.log(`Running API in NODE ${process.env.NODE_ENV} on ${await app.getUrl()}`);
  });

}

bootstrap();
