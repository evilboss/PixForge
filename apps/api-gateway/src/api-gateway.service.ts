import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ApiGatewayService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async forwardRequest(service: 'image' | 'crop', req: any) {
    // Dynamically determine target URL
    const serviceUrl =
      service === 'image'
        ? this.configService.get<string>('IMAGE_PROCESSING_URL')
        : this.configService.get<string>('IMAGE_CROPPING_URL');

    console.log('serviceUrl', serviceUrl);

    if (!serviceUrl) {
      throw new InternalServerErrorException(
        `Missing service URL for ${service}`,
      );
    }

    return this.httpService.post(serviceUrl, req.body, {
      headers: req.headers,
    });
  }
}
