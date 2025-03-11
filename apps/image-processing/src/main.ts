import { NestFactory } from '@nestjs/core';
import { ImageProcessingModule } from './image-processing.module';
import { ConfigService } from '@nestjs/config';
import { UploadMiddleware } from './image-processing.middleware';

async function bootstrap() {
  const app = await NestFactory.create(ImageProcessingModule);
  const configService = app.get(ConfigService);

  // Get the image processing service port from env or default to 4001
  app.use(new UploadMiddleware().use);

  const port = parseInt(
    configService.get<string>('IMAGE_PROCESSING_PORT') ?? '4001',
    4001,
  );
  await app.listen(port);
  console.log(`🚀 Image Processing Service is running on port ${port}`);
}

bootstrap();
