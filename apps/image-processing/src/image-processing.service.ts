import {
  Injectable,
  BadRequestException,
  MethodNotAllowedException,
} from '@nestjs/common';
import { Express } from 'express';
import {
  SharedStorageService,
  ProcessedImageResult,
} from '@app/shared-storage';

@Injectable()
export class ImageProcessingService {
  constructor(private readonly storageService: SharedStorageService) {}

  /**
   * Processes and stores an uploaded image
   */
  async processImageUpload(
    file: Express.Multer.File,
    imageType: 'game' | 'promotion',
  ): Promise<ProcessedImageResult> {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    if (!['game', 'promotion'].includes(imageType)) {
      throw new BadRequestException('Invalid image type');
    }

    return this.storageService.saveFile(file, 'uploads', imageType);
  }

  /**
   * Rejects non-POST requests
   */
  handleInvalidMethod() {
    throw new MethodNotAllowedException('Only POST requests are allowed');
  }
}
