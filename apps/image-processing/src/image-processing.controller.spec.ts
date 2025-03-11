import { Test, TestingModule } from '@nestjs/testing';
import { ImageProcessingController } from './image-processing.controller';
import { SharedStorageService } from '@app/shared-storage';
import { ImageProcessingService } from './image-processing.service';
import { Express } from 'express';
import {
  BadRequestException,
  UnsupportedMediaTypeException,
} from '@nestjs/common';

describe('ImageProcessingController', () => {
  let controller: ImageProcessingController;
  let imageProcessingService: ImageProcessingService;
  let sharedStorageService: SharedStorageService;

  const mockImageProcessingService = {
    processAndStoreImage: jest.fn().mockResolvedValue({
      message: 'Image uploaded successfully!',
      original: '/uploads/test-image.webp',
      variations: { thumbnail: '/uploads/test-image-thumbnail.webp' },
    }),
  };

  const mockStorageService = {
    uploadSingleFile: jest.fn().mockResolvedValue('/uploads/test-image.webp'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ImageProcessingController],
      providers: [
        {
          provide: ImageProcessingService,
          useValue: mockImageProcessingService,
        },
        {
          provide: SharedStorageService,
          useValue: mockStorageService,
        },
      ],
    }).compile();

    controller = module.get<ImageProcessingController>(
      ImageProcessingController,
    );
    imageProcessingService = module.get<ImageProcessingService>(
      ImageProcessingService,
    );
    sharedStorageService =
      module.get<SharedStorageService>(SharedStorageService);

    jest.spyOn(imageProcessingService, 'processAndStoreImage');
    jest.spyOn(sharedStorageService, 'uploadSingleFile');
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return 400 if no file is uploaded', async () => {
    await expect(controller.uploadImage(null as any, 'game')).rejects.toThrow(
      new BadRequestException('File is required'),
    );
  });

  it('should return 400 if an invalid image type is provided', async () => {
    const mockFile = {
      originalname: 'test-game.png',
      buffer: Buffer.from('test'),
      mimetype: 'image/png',
    } as Express.Multer.File;

    await expect(
      controller.uploadImage(mockFile, 'invalidType' as any),
    ).rejects.toThrow(
      new BadRequestException(
        'Invalid image type. Must be either "game" or "promotion".',
      ),
    );
  });

  it('should process and return a successful response for game image type', async () => {
    const mockFile: Express.Multer.File = {
      originalname: 'test-game.png',
      buffer: Buffer.from('test'),
      mimetype: 'image/png',
      fieldname: 'file',
      encoding: '',
      size: 1000,
      stream: null as any,
      destination: '',
      filename: '',
      path: '',
    };

    const result = await controller.uploadImage(mockFile, 'game');

    expect(result).toHaveProperty('message', 'Image uploaded successfully!');
    expect(result).toHaveProperty('original', '/uploads/test-image.webp');
    expect(result.variations).toHaveProperty(
      'thumbnail',
      '/uploads/test-image-thumbnail.webp',
    );
  });

  it('should process and return a successful response for promotion image type', async () => {
    const mockFile: Express.Multer.File = {
      originalname: 'test-promotion.png',
      buffer: Buffer.from('test'),
      mimetype: 'image/png',
      fieldname: 'file',
      encoding: '',
      size: 1000,
      stream: null as any,
      destination: '',
      filename: '',
      path: '',
    };

    const result = await controller.uploadImage(mockFile, 'promotion');

    expect(result).toHaveProperty('message', 'Image uploaded successfully!');
    expect(result).toHaveProperty('original', '/uploads/test-image.webp');
    expect(result.variations).toHaveProperty(
      'thumbnail',
      '/uploads/test-image-thumbnail.webp',
    );
  });

  it('should call the imageProcessingService processAndStoreImage method once', async () => {
    const mockFile: Express.Multer.File = {
      originalname: 'test-game.png',
      buffer: Buffer.from('test'),
      mimetype: 'image/png',
      fieldname: 'file',
      encoding: '',
      size: 1000,
      stream: null as any,
      destination: '',
      filename: '',
      path: '',
    };

    await controller.uploadImage(mockFile, 'game');
    expect(imageProcessingService.processAndStoreImage).toHaveBeenCalled();
  });
});
