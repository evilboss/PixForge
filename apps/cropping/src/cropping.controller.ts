import {
  Controller,
  Post,
  UploadedFile,
  Body,
  UseInterceptors,
  BadRequestException,
  Res,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CroppingService } from './cropping.service';
import { Response } from 'express';

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
    @Res() res: Response,
  ) {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    const parsedX = Number(x);
    const parsedY = Number(y);
    const parsedWidth = Number(width);
    const parsedHeight = Number(height);

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

    try {
      const result = await this.croppingService.cropImage(
        file,
        parsedX,
        parsedY,
        parsedWidth,
        parsedHeight,
        format,
      );
      const response = {
        message: 'Image cropped successfully!',
        croppedImage: result.croppedImage.toString('base64'),
      };
      res.send(response);
      // res.setHeader('Content-Type', `image/${format}`);
      // res.send(result.croppedImage);
    } catch (error) {
      console.log('error', error);
      throw new BadRequestException('Error cropping image');
    }
  }
}
