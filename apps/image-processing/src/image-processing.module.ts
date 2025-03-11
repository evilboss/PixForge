import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ImageProcessingController } from './image-processing.controller';
import { SharedStorageService } from '@app/shared-storage';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
  ],
  controllers: [ImageProcessingController],
  providers: [SharedStorageService],
  exports: [SharedStorageService],
})
export class ImageProcessingModule {}
