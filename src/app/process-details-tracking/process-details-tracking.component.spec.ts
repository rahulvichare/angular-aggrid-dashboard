import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessDetailsTrackingComponent } from './process-details-tracking.component';

describe('ProcessDetailsTrackingComponent', () => {
  let component: ProcessDetailsTrackingComponent;
  let fixture: ComponentFixture<ProcessDetailsTrackingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProcessDetailsTrackingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessDetailsTrackingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
