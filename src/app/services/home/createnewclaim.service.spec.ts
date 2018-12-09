import { TestBed, inject } from '@angular/core/testing';

import { CreatenewclaimService } from './createnewclaim.service';

describe('CreatenewclaimService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CreatenewclaimService]
    });
  });

  it('should be created', inject([CreatenewclaimService], (service: CreatenewclaimService) => {
    expect(service).toBeTruthy();
  }));
});
