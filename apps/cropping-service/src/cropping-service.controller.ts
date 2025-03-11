import { Controller, Get } from '@nestjs/common';
import { CroppingServiceService } from './cropping-service.service';

@Controller()
export class CroppingServiceController {
  constructor(private readonly croppingServiceService: CroppingServiceService) {}

  @Get()
  getHello(): string {
    return this.croppingServiceService.getHello();
  }
}
