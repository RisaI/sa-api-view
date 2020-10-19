import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { TreeviewItem } from 'ngx-treeview';
import { DataService } from 'src/app/services/data.service';
import { parseTimestamp, dateToTimestamp } from 'src/app/services/deserialization';

type CTrace = Trace & { availableRange: [any, any], xtype: string, variants?: string[] };

@Component({
  selector: 'app-trace-import-modal',
  templateUrl: './trace-import-modal.component.html',
  styleUrls: ['./trace-import-modal.component.css']
})
export class TraceImportModalComponent implements OnInit, OnChanges {

  @Input() show = false;
  @Input() graph: Graph | undefined;

  @Output() toggle = new EventEmitter();
  @Output() addGraph = new EventEmitter<Graph>();
  @Output() import = new EventEmitter<Trace[]>();

  sources: DataSource[];
  timeRange: [Date, Date];
  name: string;
  xLabel: string;
  yLabel: string;

  items: TreeviewItem[];
  selected: CTrace[] = [];
  minDate: Date;
  maxDate: Date;

  constructor(private dataClient: DataService) { }

  ngOnInit(): void {
    this.dataClient.getSources().then((s) => {
      this.sources = s;

      this.items = s.map(source => new TreeviewItem({
        text: source.name,
        value: undefined,
        collapsed: true,
        checked: false,
        children: source.datasets.map(set => new TreeviewItem({
          text: set.name,
          value: /*set.variants?.length ? undefined : */ {
            id: `${set.source}:${set.id}`,
            title: set.name,
            pipeline: {
              type: 'data',
              dataset: {
                source: set.source,
                id: set.id,
              }
            },
            variants: set.variants,
            availableRange: set.availableXRange,
            xtype: set.xType
          } as CTrace,
          collapsed: true,
          checked: false,
          // children: set.variants?.length ? set.variants.map(v => new TreeviewItem({
          //   text: v,
          //   value: {
          //     id: `${set.source}:${set.id}:${v}`,
          //     title: `${set.name} (${v})`,
          //     pipeline: {
          //       type: 'data',
          //       dataset: {
          //         source: set.source,
          //         id: set.id,
          //         variant: v,
          //       }
          //     },
          //     availableRange: set.availableXRange,
          //     xtype: set.xType
          //   } as CTrace,
          //   checked: false,
          // })) : undefined,
        }))
      }));
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.show && changes.show.currentValue && changes.show.previousValue !== changes.show.currentValue) {
      this.items.forEach(i => {
        i.setCheckedRecursive(false);
        i.setCollapsedRecursive(true);
      });
      this.selected = [];

      if (!this.graph) {
        this.timeRange = undefined;
        this.name = 'Nový graf';
        this.xLabel = 'osa x';
        this.yLabel = 'osa y';
      }
    }
  }

  onImport(): void {
    this.toggle.emit();
    const selected: CTrace[] = [];

    this.selected.forEach(t => {
      if (t.variants) {
        selected.push(...t.variants.map(v => ({
          ...t,
          id: `${t.id}:${v}`,
          title: `${t.title} (${v})`,
          variants: undefined,
          pipeline: {
            ...t.pipeline,
            dataset: {
              ...(t.pipeline as DataNodeDescriptor).dataset,
              variant: v,
            }
          }
        })));
      } else {
        selected.push(t)
      }
    });

    if (!this.graph) {
      this.addGraph.emit({
        id: 0,

        title:  this.name,
        xLabel: this.xLabel,
        yLabel: this.yLabel,

        xRange: this.timeRange.map(dateToTimestamp) as [number, number],
        traces: selected
      });
    } else {
      this.import.emit(selected);
    }
  }

  onSelectedChange = (e: CTrace[]) => {
    if (this.selected.length <= 0 && e.length > 0) {
      const type = e[0].xtype;

      // TODO: check if this works
      // this.items.forEach(i => i.children.forEach(ii => {
      //   if (ii.value.xtype !== type) {
      //     ii.setCheckedRecursive(false);
      //     ii.disabled = true;
      //   }
      // }));

      this.minDate = parseTimestamp(Math.max(...e.map(t => t.availableRange[0])));
      this.maxDate = parseTimestamp(Math.min(...e.map(t => t.availableRange[1])));
      this.timeRange = [ this.minDate, this.maxDate ];
    } else if (e.length <= 0) {
      this.timeRange = undefined;
    }

    this.selected = e;
  }

  rangeChange(range: [Date, Date]): void {
    this.timeRange = range;
  }
}
