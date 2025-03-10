import { Module } from '@nestjs/common';
import { SharedStorageService } from './shared-storage.service';

@Module({
  providers: [SharedStorageService],
  exports: [SharedStorageService],
})
export class SharedStorageModule {}
ca
