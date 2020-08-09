import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TraceImportModalComponent } from './trace-import-modal.component';

describe('TraceImportModalComponent', () => {
  let component: TraceImportModalComponent;
  let fixture: ComponentFixture<TraceImportModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TraceImportModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TraceImportModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
