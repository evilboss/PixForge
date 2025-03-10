import { Controller, Get } from '@nestjs/common';
import { ImageProcessingService } from './image-processing.service';

@Controller()
export class ImageProcessingController {
  constructor(
    private readonly imageProcessingService: ImageProcessingService,
  ) {}

  @Get()
  getHello(): string {
    return this.imageProcessingService.getHello();
  }
}
