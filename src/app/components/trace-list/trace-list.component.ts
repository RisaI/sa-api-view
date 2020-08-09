import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-trace-list',
  templateUrl: './trace-list.component.html',
  styleUrls: ['./trace-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TraceListComponent implements OnInit {

  @Input() traces: Trace[] = [];
  @Input() selected: Trace['id'][] = [];

  @Output() toggle = new EventEmitter<Trace['id']>();

  constructor() { }

  ngOnInit(): void {
  }

}
