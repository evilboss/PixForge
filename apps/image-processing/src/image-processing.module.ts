import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ImageProcessingController } from './image-processing.controller';
import { SharedStorageService } from '@app/shared-storage/shared-storage.service';
import { ImageProcessingService } from './image-processing.service'; // Import the ImageProcessingService

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'], // Ensure environment variables are loaded globally
    }),
  ],
  controllers: [ImageProcessingController], // Register the controller to handle requests
  providers: [
    SharedStorageService, // SharedStorageService is responsible for file storage
    ImageProcessingService, // Register the ImageProcessingService for processing images
  ],
  exports: [SharedStorageService, ImageProcessingService], // Export the services to be used in other modules
})
export class ImageProcessingModule {}
