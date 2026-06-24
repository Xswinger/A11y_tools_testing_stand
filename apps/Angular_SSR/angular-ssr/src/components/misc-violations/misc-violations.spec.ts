import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiscViolations } from './misc-violations';

describe('MiscViolations', () => {
  let component: MiscViolations;
  let fixture: ComponentFixture<MiscViolations>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MiscViolations]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MiscViolations);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
