import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios'; // Import HttpService

@Injectable()
export class ApiGatewayService {
  constructor(private readonly httpService: HttpService) {}

  async sendRequest() {
    try {
      const response = await this.httpService
        .get('https://example.com/api/data')
        .toPromise();
      return response;
    } catch (error) {
      throw new Error('Error making HTTP request');
    }
  }
}
