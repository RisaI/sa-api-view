import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { deserializePlotly } from '../../services/deserialization';
import { PlotlyService } from 'angular-plotly.js';
import { Plotly } from 'angular-plotly.js/src/app/shared/plotly.interface';
import { ControlsService } from 'src/app/services/controls.service';
import { faTrash, faWindowClose } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-graph-view',
  templateUrl: './graph-view.component.html',
  styleUrls: ['./graph-view.component.css'],
})
export class GraphViewComponent implements OnInit, OnChanges, OnDestroy {

  constructor(private dataService: DataService, private plotlyService: PlotlyService, private controlsService: ControlsService) { }

  faTrash = faWindowClose;

  @Input() graph: Graph;
  @Input() traces: Trace[];
  @Input() active?: boolean;

  @Output() delete = new EventEmitter();

  loadedData: any[] = [];
  graphWidth = 0;
  graphHeight = 0;
  revision = 0;

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

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.traces) {
      const newTraces: Trace[] = changes.traces.previousValue ? 
        changes.traces.currentValue.filter(t => changes.traces.previousValue.indexOf(t) < 0) : changes.traces.currentValue;
      const removedTraces: Trace[] = changes.traces.previousValue ?
        changes.traces.previousValue.filter(t => changes.traces.currentValue.indexOf(t) < 0) : [];

      this.loadedData = this.loadedData.filter(d => removedTraces.findIndex(t => t.id === d.id) < 0);

      if (newTraces.length > 0) {
        this.dataService.getTraceData(this.graph.xRange[0], this.graph.xRange[1], newTraces).then(result => {

          Promise.all(result.map(t => deserializePlotly(t[0], t[1]).then(r => {
            const idx = this.loadedData.findIndex(d => d.id === t[2].id);

            if (idx >= 0) {
              this.loadedData.find(d => d.id === t[2].id).data = r;
            } else {
              this.loadedData = [ ...this.loadedData, {
                id: t[2].id,
                type: 'scattergl',
                name: t[2].title,
                mode: 'lines+markers',
                ...r,
              } ];
            }
          }))).then(
            _ => ++this.revision
          );

        });
      }

      // asyncPool(64, newTraces, this.loadTrace).then(_ => {
      //   ++this.revision;
      // });
    }
  }

  ngOnDestroy(): void {
    this.plotlyDiv && this.plotlyService.getPlotly().purge(this.plotlyDiv);
  }

  changeExtent(width: number, height: number): void {
    this.graphWidth = width;
    this.graphHeight = height;

    ++this.revision;
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
