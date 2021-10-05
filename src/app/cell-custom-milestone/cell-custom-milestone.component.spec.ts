import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CellCustomMilestoneComponent } from './cell-custom-milestone.component';

describe('CellCustomMilestoneComponent', () => {
  let component: CellCustomMilestoneComponent;
  let fixture: ComponentFixture<CellCustomMilestoneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CellCustomMilestoneComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CellCustomMilestoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
