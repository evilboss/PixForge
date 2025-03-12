import { NestFactory } from '@nestjs/core';
import { CroppingModule } from './cropping.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(CroppingModule);
  const configService = app.get(ConfigService);
  app.enableCors();
  const port = parseInt(
    configService.get<string>('IMAGE_CROPPING_PORT') || '4002',
  );
  await app.listen(port);
  console.log(`Cropping service is running on port ${port}`);
}

bootstrap();
