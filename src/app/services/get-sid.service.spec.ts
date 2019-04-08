import { TestBed } from '@angular/core/testing';

import { GetSidService } from './get-sid.service';

describe('GetSidService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GetSidService = TestBed.get(GetSidService);
    expect(service).toBeTruthy();
  });
});
