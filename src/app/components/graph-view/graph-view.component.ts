import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { from } from 'rxjs';
import { DataService } from 'src/app/services/data.service';
import { deserialize } from '../../services/deserialization';

@Component({
  selector: 'app-graph-view',
  templateUrl: './graph-view.component.html',
  styleUrls: ['./graph-view.component.css'],
})
export class GraphViewComponent implements OnInit, OnChanges {

  @Input() graph: Graph;
  @Input() traces: Trace[];
  @Input() active?: boolean;

  @Output() selected = new EventEmitter<Graph>();

  loadedData: any[] = [];
  graphWidth = 0;
  graphHeight = 0;

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    // if (this.graph) {
    //   this.traces.forEach(t => this.loadTrace(t));
    // }
  }

  loadTrace(trace: Trace): void {
    this.dataService.getDataset(trace.sourceId, trace.datasetId).subscribe(dataset => {
      this.dataService.getDataSetData(
        dataset, undefined,
        trace.variant,
        trace.xRange && trace.xRange[0],
        trace.xRange && trace.xRange[1]
      ).subscribe(data => {
        deserialize(dataset, data).then(des => {
          const idx = this.loadedData.findIndex(d => d.id === trace.id);

          if (idx >= 0) {
            this.loadedData.find(d => d.id === trace.id).data = des;
          } else {
            this.loadedData = [ ...this.loadedData, {
              id: trace.id,
              type: 'scattergl',
              name: trace.title,
              mode: 'lines+markers',
              ...des,
            } ];
          }
        });
      });
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.traces) {
      const newTraces: Trace[] = changes.traces.currentValue.filter(t => changes.traces.previousValue.indexOf(t) < 0);
      // tslint:disable-next-line: max-line-length
      const removedTraces: Trace[] = changes.traces.previousValue ? changes.traces.previousValue.filter(t => changes.traces.currentValue.indexOf(t) < 0) : [];

      this.loadedData = this.loadedData.filter(d => removedTraces.findIndex(t => t.id === d.id) < 0);
      newTraces.forEach(t => this.loadTrace(t));
    }
  }

  changeExtent(width: number, height: number): void {
    this.graphWidth = width;
    this.graphHeight = height;
  }
}
