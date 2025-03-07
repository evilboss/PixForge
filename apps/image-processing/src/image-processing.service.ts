import { Injectable } from '@nestjs/common';

@Injectable()
export class ImageProcessingService {
  getHello(): string {
    return 'Hello World!';
  }
}
