import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImagesViolations } from './images-violations';

describe('ImagesViolations', () => {
  let component: ImagesViolations;
  let fixture: ComponentFixture<ImagesViolations>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImagesViolations]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImagesViolations);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
