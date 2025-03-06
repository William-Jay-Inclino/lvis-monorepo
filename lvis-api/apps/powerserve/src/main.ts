import { NestFactory } from '@nestjs/core';
import { PowerserveModule } from './powerserve.module';

async function bootstrap() {
  const app = await NestFactory.create(PowerserveModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
