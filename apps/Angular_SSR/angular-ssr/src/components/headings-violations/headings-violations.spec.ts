import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeadingsViolations } from './headings-violations';

describe('HeadingsViolations', () => {
  let component: HeadingsViolations;
  let fixture: ComponentFixture<HeadingsViolations>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeadingsViolations]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeadingsViolations);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
