import { Module } from '@nestjs/common';
import { ImageProcessingController } from './image-processing.controller';
import { SharedStorageModule } from '@app/shared-storage';

@Module({
  imports: [SharedStorageModule],
  controllers: [ImageProcessingController],
})
export class ImageProcessingModule {}
