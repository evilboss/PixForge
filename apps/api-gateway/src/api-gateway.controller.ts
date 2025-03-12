import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import * as FormData from 'form-data';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller()
export class ApiGatewayController {
  constructor(private readonly httpService: HttpService) {}

  @Post('process-image')
  @UseInterceptors(FileInterceptor('file'))
  async processImage(
    @UploadedFile()
    file: Express.Multer.File,
    @Body('imageType') imageType: 'game' | 'promotion',
  ) {
    console.log('process image hit');

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
      const result = await lastValueFrom(
        this.httpService.post('http://localhost:4006', formData, {
          headers: {
            ...formHeaders,
          },
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

    console.log('file', file);

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
    console.log('formData', formData);
    const formHeaders = formData.getHeaders();

    try {
      const result = await lastValueFrom(
        this.httpService.post('http://localhost:4007', formData, {
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
}
