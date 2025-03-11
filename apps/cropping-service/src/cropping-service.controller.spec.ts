import { Test, TestingModule } from '@nestjs/testing';
import { CroppingServiceController } from './cropping-service.controller';
import { CroppingServiceService } from './cropping-service.service';

describe('CroppingServiceController', () => {
  let croppingServiceController: CroppingServiceController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [CroppingServiceController],
      providers: [CroppingServiceService],
    }).compile();

    croppingServiceController = app.get<CroppingServiceController>(CroppingServiceController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(croppingServiceController.getHello()).toBe('Hello World!');
    });
  });
});
