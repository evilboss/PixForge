import {
  Injectable,
  InternalServerErrorException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { Express } from 'express';
import * as Sharp from 'sharp';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';

export interface ProcessedImageResult {
  original: string;
  variations: Record<string, string>;
}

@Injectable()
export class SharedStorageService {
  private readonly useAws: boolean;
  private readonly s3Client: S3Client | null;
  private readonly logger = new Logger(SharedStorageService.name);
  private readonly uploadDir: string = path.join(
    __dirname,
    '..',
    '..',
    'uploads',
  );

  constructor() {
    this.useAws = process.env.USE_AWS_STORAGE === 'true';

    this.s3Client = this.useAws
      ? new S3Client({
          region: process.env.AWS_REGION ?? '',
          credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? '',
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? '',
          },
        })
      : null;

    this.ensureUploadDirExists();
  }

  /**
   * Ensures the upload directory exists
   */
  private ensureUploadDirExists(): void {
    if (!this.useAws && !fs.existsSync(this.uploadDir)) {
      this.logger.log(`Creating uploads directory: ${this.uploadDir}`);
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  /**
   * Saves a file either locally or to AWS S3.
   */
  async saveFile(
    file: Express.Multer.File,
    folder: string,
    imageType?: 'game' | 'promotion',
  ): Promise<ProcessedImageResult> {
    const { originalname, buffer, mimetype } = file;
    this.logger.log(`USE_AWS_STORAGE=${process.env.USE_AWS_STORAGE}`);

    if (!originalname || !buffer || !mimetype) {
      throw new InternalServerErrorException('Invalid file data');
    }

    if (this.useAws && this.s3Client) {
      return this.uploadToS3(buffer, folder, originalname, mimetype);
    } else {
      return this.saveToLocal(buffer, folder, originalname, imageType);
    }
  }

  /**
   * Upload file to AWS S3
   */
  private async uploadToS3(
    buffer: Buffer,
    folder: string,
    filename: string,
    mimetype: string,
  ): Promise<ProcessedImageResult> {
    const fileKey = `${folder}/${Date.now()}-${filename}`;

    const uploadParams = {
      Bucket: process.env.AWS_S3_BUCKET as string,
      Key: fileKey,
      Body: buffer,
      ContentType: mimetype,
    };

    try {
      const upload = new Upload({
        client: this.s3Client as S3Client,
        params: uploadParams,
      });

      const uploadResult = await upload.done();
      this.logger.log(
        `File successfully uploaded to S3: ${uploadResult.Location}`,
      );
      return { original: uploadResult.Location as string, variations: {} };
    } catch (error) {
      this.logger.error(`S3 Upload Failed: ${(error as Error).message}`);
      throw new InternalServerErrorException(
        `Failed uploading to S3: ${(error as Error).message}`,
      );
    }
  }

  /**
   * Save file to local storage and process it
   */
  private async saveToLocal(
    buffer: Buffer,
    folder: string,
    filename: string,
    imageType?: 'game' | 'promotion',
  ): Promise<ProcessedImageResult> {
    const localPath = path.join(this.uploadDir, `${Date.now()}-${filename}`);

    try {
      fs.writeFileSync(localPath, buffer);
      this.logger.log(`File successfully saved locally at: ${localPath}`);

      if (imageType) {
        return await this.processImage(localPath, imageType);
      }

      return { original: localPath, variations: {} };
    } catch (error) {
      this.logger.error(`Local File Save Failed: ${(error as Error).message}`);
      throw new InternalServerErrorException(
        `Failed saving file locally: ${(error as Error).message}`,
      );
    }
  }

  /**
   * Convert image to WebP and create variations
   */
  private async processImage(
    filePath: string,
    imageType: 'game' | 'promotion',
  ): Promise<ProcessedImageResult> {
    try {
      const baseFileName = path.basename(filePath, path.extname(filePath));
      const outputDir = path.dirname(filePath);
      const webpFilePath = path.join(outputDir, `${baseFileName}.webp`);
      const variations: Record<string, string> = {}; // ✅ Ensure variations is always defined

      await Sharp(filePath).toFormat('webp').toFile(webpFilePath);

      if (imageType === 'game') {
        const thumbnailPath = path.join(
          outputDir,
          `${baseFileName}-thumbnail.webp`,
        );
        await Sharp(webpFilePath).resize(184, 256).toFile(thumbnailPath);
        variations['thumbnail'] = thumbnailPath;
      } else if (imageType === 'promotion') {
        const resizedPath = path.join(
          outputDir,
          `${baseFileName}-resized.webp`,
        );
        await Sharp(webpFilePath).resize(361, 240).toFile(resizedPath);
        variations['resized'] = resizedPath;
      }

      return { original: webpFilePath, variations };
    } catch (error) {
      throw new InternalServerErrorException(
        `Image Processing Failed: ${(error as Error).message}`,
      );
    }
  }
}
