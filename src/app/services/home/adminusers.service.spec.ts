import { TestBed, inject } from '@angular/core/testing';

import { AdminusersService } from './adminusers.service';

describe('AdminusersService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AdminusersService]
    });
  });

  it('should be created', inject([AdminusersService], (service: AdminusersService) => {
    expect(service).toBeTruthy();
  }));
});
