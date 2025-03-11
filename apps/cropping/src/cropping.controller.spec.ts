import { Test, TestingModule } from '@nestjs/testing';
import { CroppingController } from './cropping.controller';
import { CroppingService } from './cropping.service';
import { BadRequestException } from '@nestjs/common';

describe('CroppingController', () => {
  let controller: CroppingController;
  let croppingService: CroppingService;

  const mockCroppingService = {
    cropImage: jest.fn().mockResolvedValue({
      croppedImage: Buffer.from('mocked-image'),
    }),
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
    );

    await expect(result).rejects.toThrowError(BadRequestException);
    await expect(result).rejects.toThrowError(
      'Invalid cropping parameters. x, y, width, and height must be valid numbers.',
    );
  });

  it('should call cropImage of CroppingService with valid parameters', async () => {
    const mockFile = { buffer: Buffer.from('mock-file-buffer') } as any;
    const x = '10';
    const y = '20';
    const width = '100';
    const height = '200';
    const format = 'webp';

    await controller.cropImage(mockFile, x, y, width, height, format);

    expect(croppingService.cropImage).toHaveBeenCalledWith(
      mockFile,
      10,
      20,
      100,
      200,
      'webp',
    );
  });

  it('should return successful response when valid parameters are passed', async () => {
    const mockFile = { buffer: Buffer.from('mock-file-buffer') } as any;
    const x = '10';
    const y = '20';
    const width = '100';
    const height = '200';
    const format = 'webp';

    const response = await controller.cropImage(
      mockFile,
      x,
      y,
      width,
      height,
      format,
    );

    expect(response).toEqual({
      message: 'Image cropped successfully!',
      croppedImage: 'bW9ja2VkLWltYWdl',
    });
  });
});
