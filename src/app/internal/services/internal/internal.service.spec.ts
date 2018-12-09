import { TestBed, inject } from '@angular/core/testing';

import { InternalService } from './internal.service';

describe('InternalService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InternalService]
    });
  });

  it('should be created', inject([InternalService], (service: InternalService) => {
    expect(service).toBeTruthy();
  }));
});
