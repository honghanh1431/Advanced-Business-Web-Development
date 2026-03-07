import { TestBed } from '@angular/core/testing';

import { FashionServices } from './fashion-services';

describe('FashionServices', () => {
  let service: FashionServices;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FashionServices);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
