import { Test, TestingModule } from '@nestjs/testing';
import { SharedStorageService } from './shared-storage.service';

describe('SharedStorageService', () => {
  let service: SharedStorageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SharedStorageService],
    }).compile();

    service = module.get<SharedStorageService>(SharedStorageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
