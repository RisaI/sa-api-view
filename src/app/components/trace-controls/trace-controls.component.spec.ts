import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TraceControlsComponent } from './trace-controls.component';

describe('TraceControlsComponent', () => {
  let component: TraceControlsComponent;
  let fixture: ComponentFixture<TraceControlsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TraceControlsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TraceControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
