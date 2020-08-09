import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-graph-view',
  templateUrl: './graph-view.component.html',
  styleUrls: ['./graph-view.component.css'],
})
export class GraphViewComponent implements OnInit {

  @Input() graph: Graph;
  @Input() active?: boolean;

  @Output() selected = new EventEmitter<Graph>();

  constructor() { }

  ngOnInit(): void {
  }

}
