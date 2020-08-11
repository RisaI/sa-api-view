import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TresholdModalComponent } from './treshold-modal.component';

describe('TresholdModalComponent', () => {
  let component: TresholdModalComponent;
  let fixture: ComponentFixture<TresholdModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TresholdModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TresholdModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
