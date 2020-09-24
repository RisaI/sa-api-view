import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddGraphModalComponent } from './add-graph-modal.component';

describe('AddGraphModalComponent', () => {
  let component: AddGraphModalComponent;
  let fixture: ComponentFixture<AddGraphModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddGraphModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddGraphModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
