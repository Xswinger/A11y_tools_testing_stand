import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AriaViolations } from './aria-violations';

describe('AriaViolations', () => {
  let component: AriaViolations;
  let fixture: ComponentFixture<AriaViolations>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AriaViolations]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AriaViolations);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
