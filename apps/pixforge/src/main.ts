import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as process from 'node:process';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);
    const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

    await app.listen(port);
    console.log(`🚀 Nest Server is running on port ${port}`);
  } catch (error) {
    console.error('❌ Error starting the server:', error);
    process.exit(1);
  }
}

bootstrap().catch((err) => {
  console.error('❌ Unexpected error in bootstrap:', err);
  process.exit(1);
});
