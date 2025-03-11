import {
  Injectable,
  NestMiddleware,
  BadRequestException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as multer from 'multer';

const storage = multer.memoryStorage();
const upload = multer({
  storage: multer.memoryStorage(),
});

@Injectable()
export class SharedStorageMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log('shared storage middlewrae inboked');
    upload.single('file')(req, res, (err: any) => {
      if (err) {
        throw new BadRequestException('File upload failed.');
      }
      next();
    });
  }
}
