import { TestBed } from '@angular/core/testing';

import { DayoffstartService } from './dayoffstart.service';

describe('DayoffstartService', () => {
  let service: DayoffstartService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DayoffstartService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
