import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as multer from 'multer';

@Injectable()
export class UploadMiddleware implements NestMiddleware {
  private readonly upload = multer({ storage: multer.memoryStorage() }).single('file');

  use(req: Request, res: Response, next: NextFunction) {
    this.upload(req, res, (err: any) => {
      if (err) {
        return res.status(400).json({ message: 'File upload failed' });
      }
      next();
    });
  }
}
