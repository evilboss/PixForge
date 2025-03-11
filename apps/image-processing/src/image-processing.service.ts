import { Injectable, InternalServerErrorException } from '@nestjs/common';
import sharp from 'sharp';

@Injectable()
export class ImageProcessingService {
  /**
   * Convert an image buffer to WebP format
   */
  async convertToWebP(buffer: Buffer): Promise<Buffer> {
    try {
      return await sharp(buffer).webp().toBuffer();
    } catch (error) {
      throw new InternalServerErrorException('WebP conversion failed');
    }
  }

  /**
   * Resize an image to specified dimensions
   */
  async resizeImage(
    buffer: Buffer,
    width: number,
    height: number,
  ): Promise<Buffer> {
    try {
      return await sharp(buffer).resize(width, height).toBuffer();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new InternalServerErrorException('Image resizing failed');
    }
  }

  /**
   * Crop an image based on given dimensions
   */
  async cropImage(
    buffer: Buffer,
    left: number,
    top: number,
    width: number,
    height: number,
  ): Promise<Buffer> {
    try {
      return await sharp(buffer)
        .extract({ left, top, width, height })
        .toBuffer();
    } catch (error) {
      throw new InternalServerErrorException('Failed to crop the image');
    }
  }
}
