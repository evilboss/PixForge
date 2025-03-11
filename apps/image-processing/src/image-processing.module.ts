import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ImageProcessingController } from './image-processing.controller';
import { SharedStorageService } from '@app/shared-storage/shared-storage.service';
import { ImageProcessingService } from './image-processing.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
  ],
  controllers: [ImageProcessingController],
  providers: [SharedStorageService, ImageProcessingService],
  exports: [SharedStorageService, ImageProcessingService],
})
export class ImageProcessingModule {}
