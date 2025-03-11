import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus } from '@nestjs/common';
import * as request from 'supertest';
import { ImageProcessingModule } from '../src/image-processing.module';
import * as path from 'path';
import * as fs from 'fs';

describe('Image Processing Service (E2E)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [ImageProcessingModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  /**
   * ✅ Ensure non-POST requests return "Method Not Allowed"
   */
  it('should return 405 for non-POST requests', async () => {
    const methods = ['get', 'put', 'delete', 'patch'];
    for (const method of methods) {
      const response = await request(app.getHttpServer())[method]('/');
      expect(response.status).toBe(HttpStatus.METHOD_NOT_ALLOWED);
      expect(response.body).toHaveProperty('message', 'Method Not Allowed');
    }
  });

  /**
   * ✅ Test successful image upload and processing
   */
  it('POST / (valid file) should return success', async () => {
    const testFilePath = path.resolve(__dirname, 'test-image.png');
    fs.writeFileSync(testFilePath, Buffer.from('mock_image_data'));

    const response = await request(app.getHttpServer())
      .post('/')
      .attach('file', testFilePath)
      .field('type', 'game');

    expect(response.status).toBe(HttpStatus.OK);
    expect(response.body).toHaveProperty(
      'message',
      'Image uploaded and processed successfully!',
    );
    expect(response.body).toHaveProperty('original');
    expect(response.body).toHaveProperty('variations');
    expect(typeof response.body.original).toBe('string');
    expect(typeof response.body.variations).toBe('object');

    // Cleanup test file
    fs.unlinkSync(testFilePath);
  });

  /**
   * ❌ Test failure when no file is uploaded
   */
  it('POST / (missing file) should return 400', async () => {
    const response = await request(app.getHttpServer())
      .post('/')
      .field('type', 'game');

    expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    expect(response.body).toHaveProperty('message', 'No file uploaded');
  });

  /**
   * ❌ Test failure when imageType is missing or invalid
   */
  it('POST / (invalid image type) should return 400', async () => {
    const testFilePath = path.resolve(__dirname, 'test-invalid.png');
    fs.writeFileSync(testFilePath, Buffer.from('mock_invalid_data'));

    const response = await request(app.getHttpServer())
      .post('/')
      .attach('file', testFilePath);

    expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    expect(response.body).toHaveProperty('message', 'Invalid image type');

    fs.unlinkSync(testFilePath);
  });
});
