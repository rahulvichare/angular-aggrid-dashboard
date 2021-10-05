import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FailureStatsComponent } from './failure-stats.component';

describe('FailureStatsComponent', () => {
  let component: FailureStatsComponent;
  let fixture: ComponentFixture<FailureStatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FailureStatsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FailureStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
