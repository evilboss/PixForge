import { NestFactory } from '@nestjs/core';
import { ApiGatewayModule } from './api-gateway.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  try {
    const app = await NestFactory.create(ApiGatewayModule);
    const configService = app.get(ConfigService);

    const apiGatewayPort = parseInt(
      configService.get<string>('API_GATEWAY_PORT') || '3000',
      10,
    );

    await app.listen(apiGatewayPort);
    console.log(`🚀 API Gateway running on port ${apiGatewayPort}`);
  } catch (error) {
    console.error('❌ Error starting API Gateway:', error);
    process.exit(1);
  }
}

// ✅ Explicitly handle the promise
bootstrap().catch((err) => {
  console.error('❌ Unexpected error in bootstrap:', err);
  process.exit(1);
});
