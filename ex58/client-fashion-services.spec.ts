import { TestBed } from '@angular/core/testing';

import { ClientFashionServices } from './client-fashion-services';

describe('ClientFashionServices', () => {
  let service: ClientFashionServices;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClientFashionServices);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
