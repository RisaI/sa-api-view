import { Component } from '@angular/core';
import { ControlsService } from './services/controls.service';
import { isZero, treshold } from './services/deserialization';
import { DataService } from './services/data.service';
import { of, forkJoin, combineLatest, merge } from 'rxjs';
import { filter, map, combineAll } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  horizontal = false;
  traceImportOpen = false;
  tresholdOpen = false;

  graphs: Graph[] = [];
  selectedGraph?: Graph = undefined;
  selectedTraces: Trace['id'][] = [];

  constructor(private controlsService: ControlsService, private dataService: DataService) {

  }

  onChangeOrientation(): void {
    this.horizontal = !this.horizontal;
  }

  onAddGraph(): void {
    const newId = this.graphs.length > 0 ? Math.max(...this.graphs.map(g => g.id)) + 1 : 0;

    this.graphs = [ ...this.graphs, {
      id: newId,
      title: 'Graph ' + newId.toString(),
      xLabel: 'osa x',
      yLabel: 'osa y',
      traces: [ ],
    } ];
  }

  selectedGraphTraceIds = () => this.selectedGraph?.traces?.map(t => t.id);
  canMoveUp = () => this.graphs.indexOf(this.selectedGraph) > 0;
  canMoveDown = () => this.graphs.indexOf(this.selectedGraph) < this.graphs.length - 1;

  moveUp(): void {
    const selIdx = this.graphs.indexOf(this.selectedGraph);

    if (selIdx >= 0) {
      const temp = this.graphs[selIdx - 1];

      this.graphs[selIdx - 1] = this.graphs[selIdx];
      this.graphs[selIdx] = temp;
    }
  }

  moveDown(): void {
    const selIdx = this.graphs.indexOf(this.selectedGraph);

    if (selIdx >= 0) {
      const temp = this.graphs[selIdx + 1];

      this.graphs[selIdx + 1] = this.graphs[selIdx];
      this.graphs[selIdx] = temp;
    }
  }

  removeGraph(): void {
    const selIdx = this.graphs.indexOf(this.selectedGraph);
    this.graphs.splice(selIdx, 1);

    if (selIdx < this.graphs.length) {
      this.selectedGraph = this.graphs[selIdx];
    } else if (this.graphs.length > 0) {
      this.selectedGraph = this.graphs[this.graphs.length - 1];
    } else {
      this.selectedGraph = undefined;
    }
  }

  importTrace(trace: Trace): void {
    this.selectedGraph.traces = [ ...this.selectedGraph.traces, trace ];
  }

  toggleTrace(id: string): void {
    if (this.selectedTraces.indexOf(id) >= 0) {
      this.selectedTraces = this.selectedTraces.filter(t => t !== id);
    } else {
      this.selectedTraces = [ ...this.selectedTraces, id];
    }
  }

  async filterZero(): Promise<void> {
    const remaining: Trace[] = [];

    for (const trace of this.selectedGraph.traces) {
      const data = await this.dataService.getTraceData(trace).toPromise();

      if (!(await isZero(data[0], data[1]))) {
        remaining.push(trace);
      }
    }

    this.selectedGraph.traces = remaining;
  }

  async filterTreshold(tres: number): Promise<void> {
    const remaining: Trace[] = [];

    for (const trace of this.selectedGraph.traces) {
      const data = await this.dataService.getTraceData(trace).toPromise();

      if ((await treshold(data[0], data[1], tres))) {
        remaining.push(trace);
      }
    }

    this.selectedGraph.traces = remaining;
  }

  traceControl(action: TraceAction): void {
    switch (action) {
      case 'sel-all':
        this.selectedTraces = this.selectedGraph.traces.map(t => t.id);
        break;
      case 'sel-unq':
        const hashes = this.selectedGraph.traces.map(t => this.dataService.getTraceHash(t));
        const newSel: string[] = [];
        for (let a = hashes.length - 1; a >= 0; --a) {
          let occured = false;

          for (let b = 0; b < a; ++b) {
            if (hashes[b] === hashes[a]) {
              occured = true;
              break;
            }
          }

          if (!occured) {
            newSel.push(this.selectedGraph.traces[a].id);
          }
        }
        this.selectedTraces = newSel;
        break;
      case 'des':
        this.selectedTraces = [];
        break;
      case 'inv':
        this.selectedTraces = this.selectedGraph.traces.map(t => t.id).filter(t => this.selectedTraces.indexOf(t) < 0);
        break;
      case 'tres':
        this.tresholdOpen = true;
        break;

      case 'del-zero':
        this.filterZero().then(() => {
          this.selectedTraces = [];
        });
        break;
      case 'del-sel':
        this.selectedGraph.traces = this.selectedGraph.traces.filter(t => this.selectedTraces.indexOf(t.id) < 0);
        this.selectedTraces = [];
        break;
      case 'del-unsel':
        this.selectedGraph.traces = this.selectedGraph.traces.filter(t => this.selectedTraces.indexOf(t.id) >= 0);
        break;


      case 'zoom-sync':
        if (this.selectedGraph.zoom) {
          this.controlsService.performZoomSync(this.selectedGraph.zoom);
        }
        break;
    }
  }
}
