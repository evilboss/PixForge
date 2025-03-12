import { NestFactory } from '@nestjs/core';
import { ApiGatewayModule } from './api-gateway.module';
import { ConfigService } from '@nestjs/config';
import * as process from 'node:process';

async function bootstrap() {
  const app = await NestFactory.create(ApiGatewayModule);
  const configService = app.get(ConfigService);

  const port = configService.get<number>('API_GATEWAY_PORT') || 4005;
  await app.listen(port);
  console.log(`API Gateway runs on port ${port}`);
}

bootstrap();
