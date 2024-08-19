import { TestBed } from '@angular/core/testing';

import { StripePayService } from './stripe-pay.service';

describe('StripePayService', () => {
  let service: StripePayService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StripePayService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
