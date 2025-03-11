import { Injectable } from '@nestjs/common';
import * as sharp from 'sharp';
import * as fs from 'fs';
import * as path from 'path';
import { SharedStorageService } from '@app/shared-storage';

@Injectable()
export class ImageProcessingService {
  constructor(private readonly sharedStorageService: SharedStorageService) {}

  async processAndStoreImage(
    file: Express.Multer.File,
    imageType: 'game' | 'promotion',
  ): Promise<any> {
    const { original, variations } = await this.processImage(file, imageType);

    const uploadedFilePath = await this.sharedStorageService.uploadSingleFile(
      file,
      original,
    );

    return {
      message: 'Image uploaded successfully!',
      original: uploadedFilePath,
      variations,
    };
  }

  private async processImage(
    file: Express.Multer.File,
    imageType: 'game' | 'promotion',
  ): Promise<{ original: string; variations: any }> {
    const uniqueFileName = `${Date.now()}-${file.originalname}`;
    const outputDir = path.join('./uploads', imageType);

    await this.ensureDirectoryExists(outputDir);

    const webpFilePath = path.join(outputDir, `${uniqueFileName}.webp`);
    await sharp(file.buffer).webp().toFile(webpFilePath);

    const variations: { [key: string]: string } = {};

    if (imageType === 'game') {
      const thumbnailPath = path.join(
        outputDir,
        `${uniqueFileName}-thumbnail.webp`,
      );
      await sharp(file.buffer).resize(184, 256).webp().toFile(thumbnailPath);
      variations['thumbnail'] = thumbnailPath;
    } else if (imageType === 'promotion') {
      const resizedPath = path.join(
        outputDir,
        `${uniqueFileName}-resized.webp`,
      );
      await sharp(file.buffer).resize(361, 240).webp().toFile(resizedPath);
      variations['resized'] = resizedPath;
    }

    return {
      original: webpFilePath,
      variations,
    };
  }

  private async ensureDirectoryExists(dirPath: string): Promise<void> {
    return new Promise((resolve, reject) => {
      fs.mkdir(dirPath, { recursive: true }, (err) => {
        if (err) {
          reject(new Error(`Failed to create directory: ${err.message}`));
        } else {
          resolve();
        }
      });
    });
  }
}
