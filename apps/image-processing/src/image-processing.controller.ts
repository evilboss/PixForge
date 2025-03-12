import {
  Controller,
  Post,
  UploadedFile,
  Body,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageProcessingService } from './image-processing.service';

@Controller()
export class ImageProcessingController {
  constructor(
    private readonly imageProcessingService: ImageProcessingService,
  ) {}

  @Post('/')
  @UseInterceptors(FileInterceptor('file')) // This needs to match the form-data field name in Postman
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Body('imageType') imageType: 'game' | 'promotion',
  ) {
    if (!file) {
      throw new Error('File is required');
    }

    if (!imageType || !['game', 'promotion'].includes(imageType)) {
      throw new Error(
        'Invalid image type. Must be either "game" or "promotion".',
      );
    }

    const result = await this.imageProcessingService.processAndStoreImage(
      file,
      imageType,
    );

    const response = {
      message: 'Image uploaded successfully!',
      original: result.original,
      variations: result.variations,
    };

    return response;
  }
}
