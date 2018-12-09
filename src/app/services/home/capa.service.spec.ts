import { TestBed, inject } from '@angular/core/testing';

import { CapaService } from './capa.service';

describe('CapaService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CapaService]
    });
  });

  it('should be created', inject([CapaService], (service: CapaService) => {
    expect(service).toBeTruthy();
  }));
});
