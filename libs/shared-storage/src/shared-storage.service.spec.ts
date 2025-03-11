import { Test, TestingModule } from '@nestjs/testing';
import { SharedStorageService } from './shared-storage.service';
import path from 'path';

// ✅ Mock FS to prevent actual file operations
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

// ✅ Properly Mock Sharp for Image Processing
jest.mock('sharp', () => {
  return jest.fn(() => ({
    toFormat: jest.fn().mockImplementation(function () {
      return this; // ✅ Ensure chaining works
    }),
    resize: jest.fn().mockImplementation(function () {
      return this; // ✅ Ensure chaining works
    }),
    toFile: jest.fn().mockImplementation(async (outputPath: string) => {
      return outputPath; // ✅ Return the expected output path instead of failing
    }),
    toBuffer: jest.fn().mockResolvedValue(Buffer.from('mocked-image')), // ✅ Mock buffer return
  }));
});

describe('SharedStorageService - processImage', () => {
  let service: SharedStorageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SharedStorageService],
    }).compile();

    service = module.get<SharedStorageService>(SharedStorageService);
    jest.clearAllMocks();
  });

  it('should correctly process a game image', async () => {
    const mockFilePath = '/mocked/uploads/test-game.png';
    const result = await service['processImage'](mockFilePath, 'game');

    expect(result.original).toMatch(/test-game\.webp$/);
    expect(result.variations).toHaveProperty('thumbnail');
    expect(result.variations['thumbnail']).toMatch(
      /test-game-thumbnail\.webp$/,
    );
  });

  it('should correctly process a promotion image', async () => {
    const mockFilePath = '/mocked/uploads/test-promo.png';
    const result = await service['processImage'](mockFilePath, 'promotion');

    expect(result.original).toMatch(/test-promo\.webp$/);
    expect(result.variations).toHaveProperty('resized');
  });

  it('should return only original WebP if type is unknown', async () => {
    const mockFilePath = '/mocked/uploads/test-unknown.png';
    const result = await service['processImage'](
      mockFilePath,
      'unknown' as any,
    );

    expect(result.original).toMatch(/test-unknown\.webp$/);
    expect(result.variations).toEqual({});
  });
});
