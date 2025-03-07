import { NestFactory } from '@nestjs/core';
import { ApiGatewayModule } from './api-gateway.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(ApiGatewayModule);
  const configService = app.get(ConfigService);

  const apiGatewayPort = parseInt(
    configService.get<string>('API_GATEWAY_PORT') || '3000',
    10,
  );

  await app.listen(apiGatewayPort);
  console.log(`🚀 API Gateway running on port ${apiGatewayPort}`);
}
bootstrap();
