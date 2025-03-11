import { Module } from '@nestjs/common';
import { CroppingService } from './cropping.service';
import { CroppingController } from './cropping.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
  ],
  controllers: [CroppingController],
  providers: [CroppingService],
})
export class CroppingModule {}
