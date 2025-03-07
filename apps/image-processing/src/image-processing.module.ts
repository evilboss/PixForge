import { Module } from '@nestjs/common';
import { ImageProcessingController } from './image-processing.controller';
import { ImageProcessingService } from './image-processing.service';

@Module({
  imports: [],
  controllers: [ImageProcessingController],
  providers: [ImageProcessingService],
})
export class ImageProcessingModule {}
