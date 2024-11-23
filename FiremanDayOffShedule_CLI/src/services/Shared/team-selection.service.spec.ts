import { TestBed } from '@angular/core/testing';

import { TeamSelectionService as TeamSelectionService } from './team-selection.service';

describe('TeamSelectionServiceService', () => {
  let service: TeamSelectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TeamSelectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
