import { Test, TestingModule } from '@nestjs/testing';
import { SharedStorageService } from './shared-storage.service';
import { ProcessedImageResult } from './shared-storage.types';
import { promises as fsPromises } from 'fs';
import * as fs from 'fs';


jest.mock('fs', () => ({
  ...jest.requireActual('fs'),
  promises: {
    writeFile: jest.fn().mockResolvedValue(undefined),
    mkdir: jest.fn().mockResolvedValue(undefined),
    stat: jest.fn().mockResolvedValue({ isDirectory: () => true }),
  },
  existsSync: jest.fn().mockReturnValue(true),
  mkdirSync: jest.fn(),
  writeFileSync: jest.fn(),
}));
jest.mock('sharp', () => {
  const sharpInstance = {
    toFormat: jest.fn().mockReturnThis(),
    resize: jest.fn().mockReturnThis(),
    toFile: jest.fn().mockResolvedValue(undefined),
  };

  return jest.fn(() => sharpInstance);
});
import sharp from 'sharp';
describe('SharedStorageService', () => {
  let service: SharedStorageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SharedStorageService],
    }).compile();
    service = module.get<SharedStorageService>(SharedStorageService);
    jest.spyOn(fs, 'writeFileSync').mockImplementation(() => undefined);
    jest.spyOn(fs, 'mkdirSync').mockImplementation(() => undefined);
    jest.spyOn(fs, 'existsSync').mockReturnValue(true);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should save a file locally and process image variations', async () => {
    process.env.USE_AWS_STORAGE = 'false';

    const mockFile: Express.Multer.File = {
      originalname: 'test.png',
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

    const expectedFilePath = `/mocked/uploads/${Date.now()}-test.png`;

    await service.saveFile(mockFile, 'uploads', 'game');

    const result: ProcessedImageResult = await service.saveFile(
      mockFile,
      'uploads',
      'game',
    );

    expect(result).toEqual({
      original: expectedFilePath,
      variations: {
        thumbnail: '/mocked/uploads/test-thumbnail.webp',
      },
    });

    expect(sharp).toHaveBeenCalled();
  });

  it('should upload a file to AWS S3 when enabled', async () => {
    process.env.USE_AWS_STORAGE = 'true';

    const mockFile: Express.Multer.File = {
      originalname: 'test.png',
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

    const result: ProcessedImageResult = await service.saveFile(
      mockFile,
      'uploads',
    );
    expect(result).toHaveProperty('original');
    expect(result.original).not.toBeUndefined();
    expect(result.original).toMatch(/\.png$/);
  });
});
