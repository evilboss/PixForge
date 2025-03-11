import {
  Controller,
  Post,
  UploadedFile,
  Body,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CroppingService } from './cropping.service';

@Controller()
export class CroppingController {
  constructor(private readonly croppingService: CroppingService) {}

  @Post('/')
  @UseInterceptors(FileInterceptor('file'))
  async cropImage(
    @UploadedFile() file: Express.Multer.File,
    @Body('x') x: string,
    @Body('y') y: string,
    @Body('width') width: string,
    @Body('height') height: string,
    @Body('format') format: string = 'webp',
  ) {
    // Validate the file
    if (!file) {
      throw new BadRequestException('File is required');
    }

    const parsedX = Number(x);
    const parsedY = Number(y);
    const parsedWidth = Number(width);
    const parsedHeight = Number(height);

    // Validate that the parameters are valid numbers
    if (
      isNaN(parsedX) ||
      isNaN(parsedY) ||
      isNaN(parsedWidth) ||
      isNaN(parsedHeight)
    ) {
      throw new BadRequestException(
        'Invalid cropping parameters. x, y, width, and height must be valid numbers.',
      );
    }

    // Pass the file and cropping parameters to the service for cropping
    const result = await this.croppingService.cropImage(
      file, // Pass the entire file, not just the buffer
      parsedX,
      parsedY,
      parsedWidth,
      parsedHeight,
      format,
    );

    // Structure the response with the cropped image
    const response = {
      message: 'Image cropped successfully!',
      croppedImage: result.croppedImage.toString('base64'), // Send base64 encoded image
    };

    return response;
  }
}
