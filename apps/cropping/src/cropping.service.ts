import { Injectable } from '@nestjs/common';
import * as sharp from 'sharp';

@Injectable()
export class CroppingService {
  async cropImage(
    file: Express.Multer.File,
    x: number,
    y: number,
    width: number,
    height: number,
    format: string = 'webp',
  ): Promise<any> {
    try {
      const croppedImage = await sharp(file.buffer)
        .extract({ left: x, top: y, width, height })
        .toFormat(format as any)
        .toBuffer();

      return {
        croppedImage,
      };
    } catch (error) {
      throw new Error('Error cropping image: ' + error.message);
    }
  }
}
