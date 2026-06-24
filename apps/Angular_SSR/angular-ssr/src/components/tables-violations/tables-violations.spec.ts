import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablesViolations } from './tables-violations';

describe('TablesViolations', () => {
  let component: TablesViolations;
  let fixture: ComponentFixture<TablesViolations>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TablesViolations]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TablesViolations);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
