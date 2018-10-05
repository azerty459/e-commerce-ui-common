import { TestBed, inject } from '@angular/core/testing';

import { CaracteristiqueDataService } from './caracteristique-data.service';

describe('CaracteristiqueDataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CaracteristiqueDataService]
    });
  });

  it('should be created', inject([CaracteristiqueDataService], (service: CaracteristiqueDataService) => {
    expect(service).toBeTruthy();
  }));
});
