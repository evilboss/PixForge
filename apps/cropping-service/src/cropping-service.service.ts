import { Injectable } from '@nestjs/common';

@Injectable()
export class CroppingServiceService {
  getHello(): string {
    return 'Hello World!';
  }
}
