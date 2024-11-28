import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonDayoffInputComponent } from './person-dayoff-input.component';

describe('PersonDayoffInputComponent', () => {
  let component: PersonDayoffInputComponent;
  let fixture: ComponentFixture<PersonDayoffInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PersonDayoffInputComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PersonDayoffInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
