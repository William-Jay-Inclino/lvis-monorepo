import { NestFactory } from '@nestjs/core';
import { MotorpoolModule } from './motorpool.module';
import { config } from 'dotenv';


async function bootstrap() {

  try {
    config();
  } catch (error) {
    console.error('Error loading .env file');
    console.error(error);
    process.exit(1);
  }

  const app = await NestFactory.create(MotorpoolModule);

  app.setGlobalPrefix('/lvis/motorpool-api');

  const port = process.env.MOTORPOOL_PORT || 3000;

  await app.listen(port, async () => {
    console.log(`Running API in NODE ${process.env.NODE_ENV} on ${await app.getUrl()}`);
    process.send && process.send('ready'); // Send ready signal to PM2
  });

}

bootstrap();
