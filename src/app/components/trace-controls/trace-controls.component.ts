import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-trace-controls',
  templateUrl: './trace-controls.component.html',
  styleUrls: ['./trace-controls.component.css']
})
export class TraceControlsComponent implements OnInit {

  @Output() action = new EventEmitter<string>();

  // TODO: make this static
  buttons: { label: string, action: TraceAction }[][] = [
    [
      { label: 'Filter', action: 'filter' },
      { label: 'SelUniq', action: 'sel-unq' },
      { label: 'Search', action: 'search' },
      { label: 'Thres', action: 'tres' }
    ],
    [
      { label: 'AllSel', action: 'sel-all' },
      { label: 'InvSel', action: 'inv' },
      { label: 'DeSel', action: 'des' },
      { label: 'DelZero', action: 'del-zero' }
    ],
    [
      { label: 'Sum', action: 'sum' },
      { label: 'Average', action: 'avg' },
      { label: 'DelUnsel', action: 'del-unsel' },
      { label: 'Sort', action: 'sort' } ],
    [
      { label: 'Name Sync', action: 'name-sync' },
      { label: 'Bind Sync', action: 'bind-sync' },
      { label: 'Zoom Sync', action: 'zoom-sync' }
    ],
    // { label: 'DelSel', action: 'del-sel' },
  ];

  constructor() { }

  ngOnInit(): void {
  }
}
