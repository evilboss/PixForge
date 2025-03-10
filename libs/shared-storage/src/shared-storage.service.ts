import {
  Injectable,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as AWS from 'aws-sdk';
import { Express, Request } from 'express';
import multer, { StorageEngine } from 'multer';
import multerS3, { AUTO_CONTENT_TYPE } from 'multer-s3';

@Injectable()
export class SharedStorageService {
  private readonly useAws: boolean;
  private readonly s3: AWS.S3 | null;

  constructor() {
    this.useAws = process.env.USE_AWS_STORAGE === 'true';

    this.s3 = this.useAws
      ? new AWS.S3({
          accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? '',
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? '',
          region: process.env.AWS_REGION ?? '',
        })
      : null;
  }

  /**
   * Returns the appropriate Multer storage configuration (Local or AWS S3)
   */
  getMulterStorage(): StorageEngine {
    if (this.useAws && this.s3) {
      return multerS3({
        s3: this.s3,
        bucket: process.env.AWS_S3_BUCKET as string,
        acl: 'public-read',
        contentType: AUTO_CONTENT_TYPE,
        key: (
          req: Request,
          file: Express.Multer.File,
          callback: (error: Error | null, key: string) => void,
        ): void => {
          const { originalname } = file;

          if (!originalname) {
            callback(new BadRequestException('Invalid file'), '');
            return;
          }

          callback(null, `uploads/${Date.now()}-${originalname}`);
        },
      });
    } else {
      const uploadDir: string = path.join(__dirname, '..', '..', 'uploads');

      // Ensure the upload directory exists
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      return multer.diskStorage({
        destination: (
          req: Request,
          file: Express.Multer.File,
          callback: (error: Error | null, destination: string) => void,
        ): void => {
          callback(null, uploadDir);
        },
        filename: (
          req: Request,
          file: Express.Multer.File,
          callback: (error: Error | null, filename: string) => void,
        ): void => {
          const { originalname } = file;

          if (!originalname) {
            callback(
              new BadRequestException('Invalid file name'),
              `${Date.now()}.tmp`,
            );
            return;
          }

          callback(null, `${Date.now()}-${originalname}`);
        },
      });
    }
  }

  /**
   * Converts image to WebP and generates variations based on type.
   */
  async processImage(
    filePath: string,
    imageType: 'game' | 'promotion',
  ): Promise<{ original: string; variations: Record<string, string> }> {
    try {
      const baseFileName = path.basename(filePath, path.extname(filePath));
      const outputDir = path.dirname(filePath);
      const webpFilePath = path.join(outputDir, `${baseFileName}.webp`);
      const variations: Record<string, string> = {};

      // Convert to WebP
      await sharp(filePath).toFormat('webp').toFile(webpFilePath);

      // Create different sizes based on image type
      if (imageType === 'game') {
        const thumbnailPath = path.join(
          outputDir,
          `${baseFileName}-thumbnail.webp`,
        );
        await sharp(webpFilePath).resize(184, 256).toFile(thumbnailPath);
        variations['thumbnail'] = thumbnailPath;
      } else if (imageType === 'promotion') {
        const resizedPath = path.join(
          outputDir,
          `${baseFileName}-resized.webp`,
        );
        await sharp(webpFilePath).resize(361, 240).toFile(resizedPath);
        variations['resized'] = resizedPath;
      }

      return { original: webpFilePath, variations };
    } catch (error) {
      throw new InternalServerErrorException(
        `Error processing image: ${(error as Error).message}`,
      );
    }
  }

  /**
   * Saves a file either locally or to AWS S3.
   * @returns The stored file path or S3 URL.
   */
  async saveFile(file: Express.Multer.File, folder: string): Promise<string> {
    const { originalname, buffer, mimetype } = file;

    if (!originalname || !buffer || !mimetype) {
      throw new InternalServerErrorException('Invalid file data');
    }

    if (this.useAws && this.s3) {
      const fileName: string = `${folder}/${Date.now()}-${originalname}`;
      const params: AWS.S3.PutObjectRequest = {
        Bucket: process.env.AWS_S3_BUCKET as string,
        Key: fileName,
        Body: buffer,
        ContentType: mimetype,
      };

      try {
        const { Location } = await this.s3.upload(params).promise();
        return Location;
      } catch (error) {
        throw this.handleError(error, 'uploading to S3');
      }
    } else {
      const localPath: string = path.join(
        __dirname,
        '..',
        '..',
        folder,
        `${Date.now()}-${originalname}`,
      );

      try {
        fs.writeFileSync(localPath, buffer);
        return localPath;
      } catch (error) {
        throw this.handleError(error, 'saving file locally');
      }
    }
  }

  /**
   * Handles and formats errors safely.
   */
  private handleError(
    error: unknown,
    context: string,
  ): InternalServerErrorException {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    return new InternalServerErrorException(
      `Failed ${context}: ${errorMessage}`,
    );
  }
}
