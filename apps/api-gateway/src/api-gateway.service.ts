import { Injectable } from '@nestjs/common';

@Injectable()
export class ApiGatewayService {
  getName(): string {
    return 'Pix Forge api service!';
  }
}
