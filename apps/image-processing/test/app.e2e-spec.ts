import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { ImageProcessingModule } from '../src/image-processing.module';

describe('Image Processing (e2e)', () => {
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

  it('/images/upload (POST) should return success', async () => {
    const response = await request(app.getHttpServer())
      .post('/images/upload')
      .attach('file', Buffer.from('test'), { filename: 'test.png' })
      .field('imageType', 'game');

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('message', 'Image uploaded successfully!');
  });
});
