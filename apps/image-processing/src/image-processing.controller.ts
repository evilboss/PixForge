import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  UnsupportedMediaTypeException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { SharedStorageService } from '@app/shared-storage';
import { Express } from 'express';

@Controller('/')
export class ImageProcessingController {
  constructor(private readonly storageService: SharedStorageService) {}

  /**
   * Handles file upload and delegates processing to the storage service.
   */
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile('file') file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded.');
    }


    const allowedMimeTypes = ['image/png', 'image/jpeg', 'image/webp'];
    console.log(
      'file',
      file,
      file.mimetype,
      'allowed',
      allowedMimeTypes.includes(file.mimetype),
    );

    if (
      !allowedMimeTypes.includes(file.mimetype)
    ) {
      throw new UnsupportedMediaTypeException(
        'Only PNG, JPEG, and WebP images are allowed',
      );
    }

    // const imageType: 'game' | 'promotion' | undefined =
    //   file.originalname.includes('game')
    //     ? 'game'
    //     : file.originalname.includes('promotion')
    //       ? 'promotion'
    //       : undefined;

    // Process file using shared storage service
    const result = await this.storageService.saveFile(file, 'uploads');

    return {
      message: 'Image uploaded successfully!',
      ...result,
    };
  }
}
