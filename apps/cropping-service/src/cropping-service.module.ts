import { Module } from '@nestjs/common';
import { CroppingServiceController } from './cropping-service.controller';
import { CroppingServiceService } from './cropping-service.service';

@Module({
  imports: [],
  controllers: [CroppingServiceController],
  providers: [CroppingServiceService],
})
export class CroppingServiceModule {}
