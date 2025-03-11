import { Injectable } from '@nestjs/common';
import * as sharp from 'sharp';
import * as fs from 'fs';
import * as path from 'path';
import { SharedStorageService } from '@app/shared-storage';

@Injectable()
export class ImageProcessingService {
  constructor(private readonly sharedStorageService: SharedStorageService) {}

  // Process the image based on its type (Game or Promotion)
  async processAndStoreImage(
    file: Express.Multer.File,
    imageType: 'game' | 'promotion',
  ): Promise<any> {
    // Step 1: Process the image (convert to WebP and create variations)
    const { original, variations } = await this.processImage(file, imageType);

    // Step 2: Use SharedStorageService to upload the processed file
    const uploadedFilePath = await this.sharedStorageService.uploadSingleFile(
      file,
      original,
    );

    // Return the response object with message and file paths
    return {
      message: 'Image uploaded successfully!',
      original: uploadedFilePath, // This would be the path to the WebP file
      variations, // Variations like thumbnail or resized
    };
  }

  // Core image processing logic
  private async processImage(
    file: Express.Multer.File,
    imageType: 'game' | 'promotion',
  ): Promise<{ original: string; variations: any }> {
    const uniqueFileName = `${Date.now()}-${file.originalname}`;
    const outputDir = path.join('./uploads', imageType);

    // Ensure the directory exists before writing files
    await this.ensureDirectoryExists(outputDir);

    // Convert to WebP format and save the WebP file
    const webpFilePath = path.join(outputDir, `${uniqueFileName}.webp`);
    await sharp(file.buffer).webp().toFile(webpFilePath);

    // Create variations based on image type
    const variations: { [key: string]: string } = {};

    if (imageType === 'game') {
      // Create a thumbnail (184x256) for game images
      const thumbnailPath = path.join(outputDir, `${uniqueFileName}-thumbnail.webp`);
      await sharp(file.buffer).resize(184, 256).webp().toFile(thumbnailPath);
      variations['thumbnail'] = thumbnailPath;
    } else if (imageType === 'promotion') {
      // Create a resized version (361x240) for promotion images
      const resizedPath = path.join(outputDir, `${uniqueFileName}-resized.webp`);
      await sharp(file.buffer).resize(361, 240).webp().toFile(resizedPath);
      variations['resized'] = resizedPath;
    }

    return {
      original: webpFilePath, // Returning the WebP file path
      variations, // Variations like thumbnail or resized
    };
  }

  // Utility to ensure the directory exists before writing files
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
