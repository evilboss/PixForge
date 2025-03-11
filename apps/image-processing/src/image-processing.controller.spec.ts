import { Test, TestingModule } from '@nestjs/testing';
import { ImageProcessingController } from './image-processing.controller';
import { SharedStorageService } from '@app/shared-storage';
import { Express } from 'express';
import {
  BadRequestException,
  UnsupportedMediaTypeException,
} from '@nestjs/common';

describe('ImageProcessingController', () => {
  let controller: ImageProcessingController;
  let storageService: SharedStorageService;

  const mockStorageService = {
    saveFile: jest.fn().mockResolvedValue({
      original: '/uploads/test-image.webp',
      variations: { thumbnail: '/uploads/test-image-thumbnail.webp' },
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ImageProcessingController],
      providers: [
        {
          provide: SharedStorageService,
          useValue: mockStorageService,
        },
      ],
    }).compile();

    controller = module.get<ImageProcessingController>(
      ImageProcessingController,
    );
    storageService = module.get<SharedStorageService>(SharedStorageService);

    jest.spyOn(storageService, 'saveFile');
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return 400 if no file is uploaded', async () => {
    await expect(controller.uploadFile(null as any)).rejects.toThrow(
      new BadRequestException('No file uploaded.'),
    );
  });

  it('should return 415 if an unsupported file format is uploaded', async () => {
    const mockFile = {
      originalname: 'test.txt',
      buffer: Buffer.from('test'),
      mimetype: 'text/plain',
    } as Express.Multer.File;

    await expect(controller.uploadFile(mockFile)).rejects.toThrow(
      new UnsupportedMediaTypeException(
        'Only PNG, JPEG, and WebP images are allowed',
      ),
    );
  });

  it('should process and return a successful response', async () => {
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

    const response = await controller.uploadFile(mockFile);

    expect(response).toHaveProperty('message', 'Image uploaded successfully!');
    expect(response).toHaveProperty('original', '/uploads/test-image.webp');
    expect(response.variations).toHaveProperty(
      'thumbnail',
      '/uploads/test-image-thumbnail.webp',
    );
  });

  it('should call the storage service method once', async () => {
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

    await controller.uploadFile(mockFile);

    expect(storageService.saveFile).toHaveBeenCalled();
  });
});
