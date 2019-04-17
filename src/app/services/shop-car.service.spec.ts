import { TestBed } from '@angular/core/testing';

import { ShopCarService } from './shop-car.service';

describe('ShopCarService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ShopCarService = TestBed.get(ShopCarService);
    expect(service).toBeTruthy();
  });
});
