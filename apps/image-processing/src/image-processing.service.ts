import { Injectable } from '@nestjs/common';
import * as sharp from 'sharp';
import * as fs from 'fs';
import * as path from 'path';
import { SharedStorageService } from '@app/shared-storage';

const imageTypes = {
  game: {
    suffix: 'thumbnail',
    width: 184,
    height: 256,
    variation: 'thumbnail',
  },
  promotion: {
    suffix: 'promotion',
    width: 361,
    height: 240,
    variation: 'promotion',
  },
};

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

    const { width, height, suffix, variation } = imageTypes[imageType];

    const webpFilePath = path.join(outputDir, `${uniqueFileName}.webp`);
    await sharp(file.buffer).webp().toFile(webpFilePath);

    const variations: { [key: string]: string } = {};

    const variationFilePath = path.join(
      outputDir,
      `${uniqueFileName}-${suffix}.webp`,
    );

    await sharp(file.buffer)
      .resize(width, height)
      .webp()
      .toFile(variationFilePath);

    variations[variation] = variationFilePath;

    console.log(file.originalname)

    return {
      original: webpFilePath,
      variations: { ...variations },
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
