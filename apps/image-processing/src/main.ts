import { NestFactory } from '@nestjs/core';
import { ImageProcessingModule } from './image-processing.module';
import { ConfigService } from '@nestjs/config';
import { UploadMiddleware } from './image-processing.middleware';

async function bootstrap() {
  const app = await NestFactory.create(ImageProcessingModule);
  const configService = app.get(ConfigService);

  app.use(new UploadMiddleware().use);
  const port = parseInt(
    configService.get<string>('IMAGE_PROCESSING_PORT') || '4001',
  );
  console.log('app set to port', port);
  await app.listen(port);
  console.log(`🚀 Image Processing Service is running on port ${port}`);
}

bootstrap();
