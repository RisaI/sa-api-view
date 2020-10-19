import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { DataService } from 'src/app/services/data.service';

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
  @Output() showLdevMap = new EventEmitter<string>();

  sources: DataSource[] = [];

  constructor(private data: DataService) { }

  ngOnInit(): void {
    this.data.getSources().then(s => this.sources = s);
  }

  hasLdevMaps = (trace: Trace) =>
    trace.pipeline.type === 'data' &&
    (trace.pipeline as DataNodeDescriptor).dataset.id.startsWith('LDEV') &&
    this.sources.find(s => s.id === (trace.pipeline as DataNodeDescriptor).dataset.source)?.features.indexOf('ldev_map') >= 0

  getLdevId = (trace: Trace) => (trace.pipeline as DataNodeDescriptor).dataset.variant;
}
