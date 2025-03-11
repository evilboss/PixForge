import { NestFactory } from '@nestjs/core';
import { CroppingServiceModule } from './cropping-service.module';

async function bootstrap() {
  const app = await NestFactory.create(CroppingServiceModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
