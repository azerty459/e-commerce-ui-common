import { TestBed, inject } from '@angular/core/testing';

import { CategorieBusinessService } from './categorie-business.service';

describe('CategorieBusinessService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CategorieBusinessService]
    });
  });

  it('should be created', inject([CategorieBusinessService], (service: CategorieBusinessService) => {
    expect(service).toBeTruthy();
  }));
});
