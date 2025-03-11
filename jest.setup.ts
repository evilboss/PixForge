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

jest.mock('@aws-sdk/client-s3', () => {
  return {
    S3Client: jest.fn().mockImplementation(() => ({
      send: jest.fn().mockResolvedValue({
        Location: 'https://s3.amazonaws.com/test-image.webp',
      }),
    })),
    PutObjectCommand: jest.fn(),
  };
});

jest.mock('sharp', () => {
  return jest.fn(() => ({
    toFormat: jest.fn().mockReturnThis(),
    toFile: jest.fn().mockResolvedValue(undefined),
    resize: jest.fn().mockReturnThis(),
    extract: jest.fn().mockReturnThis(),
  }));
});
