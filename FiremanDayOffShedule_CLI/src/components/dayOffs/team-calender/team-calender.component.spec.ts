import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamCalenderComponent } from './team-calender.component';

describe('TeamCalenderComponent', () => {
  let component: TeamCalenderComponent;
  let fixture: ComponentFixture<TeamCalenderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeamCalenderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeamCalenderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
