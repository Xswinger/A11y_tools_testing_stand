import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinksViolations } from './links-violations';

describe('LinksViolations', () => {
  let component: LinksViolations;
  let fixture: ComponentFixture<LinksViolations>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LinksViolations]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LinksViolations);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
