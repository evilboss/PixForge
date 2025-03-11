import {
  Injectable,
  NestMiddleware,
  BadRequestException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as multer from 'multer';

const upload = multer({ dest: 'uploads/' });

@Injectable()
export class ImageProcessingMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log('📌 Middleware invoked');

    upload.single('file')(req, res, (err: any) => {
      if (err) {
        console.error('❌ Multer error:', err);
        return res
          .status(400)
          .json({ error: 'File upload failed.', details: err });
      }

      if (!req.file) {
        console.error('❌ No file detected');
        return res.status(400).json({ error: 'No file uploaded' });
      }

      console.log('✅ Middleware executed successfully, file:', req.file);
      next();
    });
  }
}
