import {
  Controller,
  Post,
  UploadedFile,
  Body,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageProcessingService } from './image-processing.service';

@Controller() // The root path is automatically inferred
export class ImageProcessingController {
  constructor(
    private readonly imageProcessingService: ImageProcessingService,
  ) {}

  @Post('/') // Explicitly bind the POST request to the root path
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Body('imageType') imageType: 'game' | 'promotion', // Get the image type from the body
  ) {
    // Validate the file and imageType directly in the controller
    if (!file) {
      throw new Error('File is required');
    }

    if (!imageType || !['game', 'promotion'].includes(imageType)) {
      throw new Error(
        'Invalid image type. Must be either "game" or "promotion".',
      );
    }

    // Process the image and upload it
    const result = await this.imageProcessingService.processAndStoreImage(
      file,
      imageType,
    );

    // Structure the response based on the image type
    const response = {
      message: 'Image uploaded successfully!',
      original: result.original, // The WebP file path
      variations: result.variations, // Thumbnail or resized, based on the image type
    };

    return response;
  }
}
