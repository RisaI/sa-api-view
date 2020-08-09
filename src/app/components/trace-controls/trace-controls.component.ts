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
    // tslint:disable-next-line: max-line-length
    [ { label: 'SelUnq', action: 'sel-unq' }, { label: 'SelAll', action: 'sel-all' }, { label: 'Inv', action: 'inv' }, { label: 'Des', action: 'des' }, { label: 'Tres', action: 'tres' } ],
    // tslint:disable-next-line: max-line-length
    [ { label: 'Sort', action: 'sort' }, { label: 'Filter', action: 'filter' }, { label: 'Search', action: 'search' }, { label: 'Sum', action: 'sum' }, { label: 'Avg', action: 'avg' } ],
    [ { label: 'DelZero', action: 'del-zero' }, { label: 'DelSel', action: 'del-sel' }, { label: 'DelUnsel', action: 'del-unsel' } ],
    [ { label: 'NameS', action: 'name-sync' }, { label: 'BindS', action: 'bind-sync' }, { label: 'ZoomS', action: 'zoom-sync' } ],
  ];

  constructor() { }

  ngOnInit(): void {
  }
}
