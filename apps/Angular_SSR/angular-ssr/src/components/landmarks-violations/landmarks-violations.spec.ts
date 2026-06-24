import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LandmarksViolations } from './landmarks-violations';

describe('LandmarksViolations', () => {
  let component: LandmarksViolations;
  let fixture: ComponentFixture<LandmarksViolations>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LandmarksViolations]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LandmarksViolations);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
