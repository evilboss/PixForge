import { Test, TestingModule } from '@nestjs/testing';
import { CroppingController } from './cropping.controller';
import { CroppingService } from './cropping.service';
import { BadRequestException } from '@nestjs/common';
import { Response } from 'express';

describe('CroppingController', () => {
  let controller: CroppingController;
  let croppingService: CroppingService;
  let res: Response;

  const mockCroppingService = {
    cropImage: jest.fn().mockResolvedValue(Buffer.from('mocked-image')),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CroppingController],
      providers: [
        {
          provide: CroppingService,
          useValue: mockCroppingService,
        },
      ],
    }).compile();

    controller = module.get<CroppingController>(CroppingController);
    croppingService = module.get<CroppingService>(CroppingService);

    res = {
      setHeader: jest.fn(),
      end: jest.fn(),
    } as any;

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should throw BadRequestException if file is missing', async () => {
    const result = controller.cropImage(
      null as any,
      '100',
      '100',
      '200',
      '200',
      'webp',
      res,
    );

    await expect(result).rejects.toThrowError(BadRequestException);
    await expect(result).rejects.toThrowError('File is required');
  });

  it('should throw BadRequestException if cropping parameters are invalid', async () => {
    const result = controller.cropImage(
      { buffer: Buffer.from('file-buffer') } as any,
      'invalid-x',
      '100',
      '200',
      '200',
      'webp',
      res,
    );

    await expect(result).rejects.toThrowError(BadRequestException);
    await expect(result).rejects.toThrowError(
      'Invalid cropping parameters. x, y, width, and height must be valid numbers.',
    );
  });
});
