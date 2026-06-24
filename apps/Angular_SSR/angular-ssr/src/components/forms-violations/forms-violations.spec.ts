import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormsViolations } from './forms-violations';

describe('FormsViolations', () => {
  let component: FormsViolations;
  let fixture: ComponentFixture<FormsViolations>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsViolations]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormsViolations);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
