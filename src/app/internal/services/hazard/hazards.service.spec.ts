import { TestBed, inject } from '@angular/core/testing';

import { HazardsService } from './hazards.service';

describe('HazardsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HazardsService]
    });
  });

  it('should be created', inject([HazardsService], (service: HazardsService) => {
    expect(service).toBeTruthy();
  }));
});
