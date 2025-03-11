import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class SharedStorageService {
  private s3: AWS.S3;
  private useS3: boolean;
  private localStorageDir: string;

  constructor(private configService: ConfigService) {
    this.useS3 = this.configService.get<boolean>('USE_S3_STORAGE', false);
    this.localStorageDir = this.configService.get<string>(
      'LOCAL_STORAGE_DIR',
      './uploads',
    );

    if (this.useS3) {
      this.s3 = new AWS.S3({
        accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get<string>(
          'AWS_SECRET_ACCESS_KEY',
        ),
        region: this.configService.get<string>('AWS_REGION'),
      });
    }
  }

  async uploadSingleFile(
    file: Express.Multer.File,
    folderPath: string,
  ): Promise<string> {
    const filePath = path.join(folderPath, file.originalname);

    if (this.useS3) {
      return await this.uploadToS3(file, filePath);
    } else {
      return await this.uploadToLocal(file, filePath);
    }
  }

  private async uploadToS3(
    file: Express.Multer.File,
    filePath: string,
  ): Promise<string> {
    const bucketName = this.configService.get<string>('AWS_BUCKET_NAME');

    if (!bucketName) {
      throw new Error(
        'AWS_BUCKET_NAME is not defined in the environment variables.',
      );
    }

    const params = {
      Bucket: bucketName,
      Key: filePath,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: 'public-read',
    };

    try {
      const data = await this.s3.upload(params).promise();
      return data.Location;
    } catch (error) {
      throw new Error(`Failed to upload file to S3: ${error.message}`);
    }
  }

  private async uploadToLocal(
    file: Express.Multer.File,
    filePath: string,
  ): Promise<string> {
    const dirPath = path.dirname(filePath);
    console.log('dirPath', dirPath);
    console.log('filePath', filePath);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    try {
      fs.writeFileSync(dirPath, file.buffer);
      return dirPath;
    } catch (error) {
      throw new Error(`Failed to write file locally: ${error.message}`);
    }
  }
}
