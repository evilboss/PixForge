import { NestFactory } from '@nestjs/core';
import { ImageProcessingModule } from './image-processing.module';

async function bootstrap() {
  const app = await NestFactory.create(ImageProcessingModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
