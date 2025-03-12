import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
  UseInterceptors,
  UploadedFile,
  Get,
  UseGuards,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import * as FormData from 'form-data';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiKeyGuard } from './api-key.guard';

@Controller()
export class ApiGatewayController {
  private readonly imageProcessingUrl: string;
  private readonly imageCroppingUrl: string;

  constructor(private readonly httpService: HttpService) {

    this.imageProcessingUrl = process.env.IMAGE_PROCESSING_URL || 'http://image-processing:4006';
    this.imageCroppingUrl = process.env.IMAGE_CROPPING_URL || 'http://image-cropping:4007';
  }

  @Post('process-image')
  @UseGuards(ApiKeyGuard)
  @UseInterceptors(FileInterceptor('file'))
  async processImage(
    @UploadedFile() file: Express.Multer.File,
    @Body('imageType') imageType: 'game' | 'promotion',
  ) {

    if (!imageType) {
      throw new HttpException('imageType is required', HttpStatus.BAD_REQUEST);
    }

    const formData = new FormData();
    formData.append('file', file.buffer, {
      filename: file.originalname,
      contentType: file.mimetype,
    });
    formData.append('imageType', imageType);

    const formHeaders = formData.getHeaders();

    try {
      console.log(`Forwarding request to: ${this.imageProcessingUrl}`);
      const result = await lastValueFrom(
        this.httpService.post(`${this.imageProcessingUrl}`, formData, {
          headers: formHeaders,
        }),
      );

      return result.data;
    } catch (e) {
      console.error('Error forwarding the image-processing request:', e);
      throw new HttpException(
        'Error forwarding the image-processing request',
        HttpStatus.BAD_GATEWAY,
      );
    }
  }

  @Post('crop-image')
  @UseGuards(ApiKeyGuard)
  @UseInterceptors(FileInterceptor('file'))
  async cropImage(
    @UploadedFile() file: Express.Multer.File,
    @Body('x') x: string,
    @Body('y') y: string,
    @Body('width') width: string,
    @Body('height') height: string,
    @Body('format') format: string = 'webp',
  ) {
    console.log('crop-image hit');

    if (!file) {
      throw new HttpException('File is required', HttpStatus.BAD_REQUEST);
    }


    const formData = new FormData();
    formData.append('file', file.buffer, {
      filename: file.originalname,
      contentType: file.mimetype,
    });

    formData.append('x', x);
    formData.append('y', y);
    formData.append('width', width);
    formData.append('height', height);
    formData.append('format', format);
    const formHeaders = formData.getHeaders();

    try {
      console.log(`Forwarding request to: ${this.imageCroppingUrl}`);
      const result = await lastValueFrom(
        this.httpService.post(`${this.imageCroppingUrl}`, formData, {
          headers: formHeaders,
        }),
      );

      return result.data;
    } catch (e) {
      console.error('Error forwarding the crop-image request:', e);
      throw new HttpException(
        'Error forwarding the crop-image request',
        HttpStatus.BAD_GATEWAY,
      );
    }
  }

  @Get('/health')
  async healthCheck() {
    return 'OK';
  }
}
