import { TestBed, inject } from '@angular/core/testing';

import { CategoriedataService } from './categoriedata.service';

describe('CategoriedataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CategoriedataService]
    });
  });

  it('should be created', inject([CategoriedataService], (service: CategoriedataService) => {
    expect(service).toBeTruthy();
  }));
});
