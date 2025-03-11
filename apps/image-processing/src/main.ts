import { NestFactory } from '@nestjs/core';
import { ImageProcessingModule } from './image-processing.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(ImageProcessingModule);
  const configService = app.get(ConfigService);

  const port = parseInt(
    configService.get<string>('IMAGE_PROCESSING_PORT') || '4001',
  );

  await app.listen(port);
}

bootstrap();
