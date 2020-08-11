import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { deserializePlotly, parseTimestamp } from '../../services/deserialization';
import { PlotlyService } from 'angular-plotly.js';
import { Plotly } from 'angular-plotly.js/src/app/shared/plotly.interface';
import { ControlsService } from 'src/app/services/controls.service';

@Component({
  selector: 'app-graph-view',
  templateUrl: './graph-view.component.html',
  styleUrls: ['./graph-view.component.css'],
})
export class GraphViewComponent implements OnInit, OnChanges {

  constructor(private dataService: DataService, private plotlyService: PlotlyService, private controlsService: ControlsService) { }

  @Input() graph: Graph;
  @Input() traces: Trace[];
  @Input() active?: boolean;

  @Output() selected = new EventEmitter<Graph>();

  loadedData: any[] = [];
  graphWidth = 0;
  graphHeight = 0;

  private plotlyDiv: Plotly.PlotlyHTMLElement;
  private plotlyInstance: Plotly.Figure;

  ngOnInit(): void {
    this.controlsService.zoomSync.subscribe(z => {
      this.plotlyService.getPlotly().relayout(this.plotlyDiv, {
        'xaxis.range': z[0],
        'yaxis.range': z[1],
      });
    });
  }

  loadTrace(trace: Trace): void {
    this.dataService.getTraceData(trace).subscribe(([dataset, data]) => {
      deserializePlotly(dataset, data).then(des => {
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
      })
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.traces) {
      const newTraces: Trace[] = changes.traces.currentValue.filter(t => changes.traces.previousValue.indexOf(t) < 0);
      // tslint:disable-next-line: max-line-length
      const removedTraces: Trace[] = changes.traces.previousValue ? changes.traces.previousValue.filter(t => changes.traces.currentValue.indexOf(t) < 0) : [];

      this.loadedData = this.loadedData.filter(d => removedTraces.findIndex(t => t.id === d.id) < 0);
      newTraces.forEach(t => this.loadTrace(t));


      // tslint:disable-next-line: max-line-length
      // this.plotlyService.getPlotly().relayout(this.plotlyInstance, { 'xaxis.range': [new Date(new Date().getTime() - 1000 * 3600 * 24), new Date()] });
      // console.log(this.plotl)
    }
  }

  changeExtent(width: number, height: number): void {
    this.graphWidth = width;
    this.graphHeight = height;
  }
  bindInstance(instance: any): void {
    this.plotlyInstance = instance;
    this.plotlyDiv = this.plotlyService.getInstanceByDivId(`graph-${this.graph.id}`);
  }

  onUpdate(): void {
    this.graph.zoom = [
      this.plotlyInstance.layout.xaxis.range.map(a => new Date(a)),
      this.plotlyInstance.layout.yaxis.range as [any, any]
    ];
  }
}
