import { TestBed, inject } from '@angular/core/testing';

import { CreatecapaService } from './createcapa.service';

describe('CreatecapaService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CreatecapaService]
    });
  });

  it('should be created', inject([CreatecapaService], (service: CreatecapaService) => {
    expect(service).toBeTruthy();
  }));
});
