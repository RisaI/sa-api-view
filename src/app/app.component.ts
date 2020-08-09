import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'sa-api-view';

  horizontal = false;
  traceImportOpen = false;

  graphs: Graph[] = [];
  selectedGraph?: Graph = undefined;
  selectedTraces: Trace['id'][] = [];

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

  traceControl(action: TraceAction): void {
    switch (action) {
      case 'sel-all':
        this.selectedTraces = this.selectedGraph.traces.map(t => t.id);
        break;
      case 'sel-unq':
        // TODO:
        break;
      case 'des':
        this.selectedTraces = [];
        break;
      case 'inv':
        this.selectedTraces = this.selectedGraph.traces.map(t => t.id).filter(t => this.selectedTraces.indexOf(t) < 0);
        break;
      case 'tres':
        // TODO:
        break;

      case 'del-zero':
        // TODO:
        break;
      case 'del-sel':
        this.selectedGraph.traces = this.selectedGraph.traces.filter(t => this.selectedTraces.indexOf(t.id) < 0);
        this.selectedTraces = [];
        break;
      case 'del-unsel':
        this.selectedGraph.traces = this.selectedGraph.traces.filter(t => this.selectedTraces.indexOf(t.id) >= 0);
        this.selectedTraces = [];
        break;
    }
  }
}
