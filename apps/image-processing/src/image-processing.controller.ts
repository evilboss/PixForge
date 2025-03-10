import { Controller, Post, UploadedFile, UseInterceptors, Body } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { SharedStorageService } from '@app/shared-storage';

@Controller('images')
export class ImageProcessingController {
  constructor(private readonly storageService: SharedStorageService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Body('imageType') imageType: 'game' | 'promotion'
  ) {
    const result = await this.storageService.saveFile(file, 'uploads', imageType);

    // ✅ Ensure result is an object before spreading
    if (!result || typeof result !== 'object') {
      throw new Error('Unexpected result from saveFile method');
    }

    return {
      message: 'Image uploaded successfully!',
      original: result.original,
      variations: result.variations ?? {},
    };
  }
}
