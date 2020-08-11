import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-treshold-modal',
  templateUrl: './treshold-modal.component.html',
  styleUrls: ['./treshold-modal.component.css']
})
export class TresholdModalComponent implements OnInit {

  @Input() show = false;

  @Output() toggle = new EventEmitter();
  @Output() treshold = new EventEmitter<number>();

  value = 0;

  constructor() { }

  ngOnInit(): void {
  }

  onSubmit(): void {
    this.treshold.emit(this.value);
  }
}
