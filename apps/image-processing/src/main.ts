import { NestFactory } from '@nestjs/core';
import { ImageProcessingModule } from './image-processing.module';

async function bootstrap() {
  const app = await NestFactory.create(ImageProcessingModule);

  const port = process.env.IMAGE_PROCESSING_PORT ? parseInt(process.env.IMAGE_PROCESSING_PORT, 10) : 3001;

  await app.listen(port);
  console.log(`🚀 Image Processing Service running on port ${port}`);
}

bootstrap();
