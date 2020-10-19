import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LdevMapModalComponent } from './ldev-map-modal.component';

describe('LdevMapModalComponent', () => {
  let component: LdevMapModalComponent;
  let fixture: ComponentFixture<LdevMapModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LdevMapModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LdevMapModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
