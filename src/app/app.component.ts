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
  selectedId?: Graph['id'] = undefined;
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

  selectedGraph = () => this.graphs.find(g => g.id === this.selectedId);
  canMoveUp = () => this.graphs.findIndex(g => g.id === this.selectedId) > 0;
  canMoveDown = () => this.graphs.findIndex(g => g.id === this.selectedId) < this.graphs.length - 1;

  moveUp(): void {
    const selIdx = this.graphs.findIndex(g => g.id === this.selectedId);

    if (selIdx >= 0) {
      const temp = this.graphs[selIdx - 1];

      this.graphs[selIdx - 1] = this.graphs[selIdx];
      this.graphs[selIdx] = temp;
    }
  }

  moveDown(): void {
    const selIdx = this.graphs.findIndex(g => g.id === this.selectedId);

    if (selIdx >= 0) {
      const temp = this.graphs[selIdx + 1];

      this.graphs[selIdx + 1] = this.graphs[selIdx];
      this.graphs[selIdx] = temp;
    }
  }

  removeGraph(): void {
    const selIdx = this.graphs.findIndex(g => g.id === this.selectedId);
    this.graphs.splice(selIdx, 1);

    if (selIdx < this.graphs.length) {
      this.selectedId = this.graphs[selIdx].id;
    } else if (this.graphs.length > 0) {
      this.selectedId = this.graphs[this.graphs.length - 1].id;
    } else {
      this.selectedId = undefined;
    }
  }
}
