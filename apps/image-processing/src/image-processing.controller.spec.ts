import { Test, TestingModule } from '@nestjs/testing';
import { ImageProcessingController } from './image-processing.controller';
import { ImageProcessingService } from './image-processing.service';

describe('ImageProcessingController', () => {
  let imageProcessingController: ImageProcessingController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ImageProcessingController],
      providers: [ImageProcessingService],
    }).compile();

    imageProcessingController = app.get<ImageProcessingController>(
      ImageProcessingController,
    );
  });
});
