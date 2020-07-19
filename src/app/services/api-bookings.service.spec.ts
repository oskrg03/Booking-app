import { TestBed } from '@angular/core/testing';

import { ApiBookingsService } from './api-bookings.service';

describe('ApiBookingsService', () => {
  let service: ApiBookingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiBookingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
