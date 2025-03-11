import { Module } from '@nestjs/common';
import { ImageProcessingController } from './image-processing.controller';
import { SharedStorageService } from '@app/shared-storage';

@Module({
  controllers: [ImageProcessingController],
  providers: [SharedStorageService],
  exports: [SharedStorageService],
})
export class ImageProcessingModule {}
