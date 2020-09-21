import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TreeviewItem } from 'ngx-treeview';
import { DataService } from 'src/app/services/data.service';
import { parseTimestamp, dateToTimestamp } from 'src/app/services/deserialization';

type CTrace = Trace & { availableRange: [any, any] };

@Component({
  selector: 'app-trace-import-modal',
  templateUrl: './trace-import-modal.component.html',
  styleUrls: ['./trace-import-modal.component.css']
})
export class TraceImportModalComponent implements OnInit {

  @Input() show = false;
  @Input() usedIds: string[] = [];

  @Output() toggle = new EventEmitter();
  @Output() import = new EventEmitter<Trace[]>();

  sources: DataSource[];

  id: string;
  title: string;
  timeRange: [Date, Date];

  items: TreeviewItem[];
  selected: CTrace[];

  constructor(private dataClient: DataService) { }

  ngOnInit(): void {
    this.dataClient.getSources().subscribe((s) => {
      this.sources = s;

      this.items = s.map(source => new TreeviewItem({
        text: source.name,
        value: undefined,
        collapsed: true,
        checked: false,
        children: source.datasets.map(set => new TreeviewItem({
          text: set.name,
          value: set.variants?.length ? undefined : {
            id: `${set.source}:${set.id}`,
            title: set.name,
            pipeline: {
              type: 'data',
              dataset: {
                source: set.source,
                id: set.id,
              }
            },
            availableRange: set.availableXRange,
          } as CTrace,
          collapsed: true,
          checked: false,
          children: set.variants?.length ? set.variants.map(v => new TreeviewItem({
            text: v,
            value: {
              id: `${set.source}:${set.id}:${v}`,
              title: `${set.name} (${v})`,
              pipeline: {
                type: 'data',
                dataset: {
                  source: set.source,
                  id: set.id,
                  variant: v,
                }
              },
              availableRange: set.availableXRange,
            } as CTrace,
            checked: false,
          })) : undefined,
        }))
      }));
    });
  }

  onImport(): void {
    this.selected.forEach(s => s.xRange = this.timeRange.map(dateToTimestamp) as [number, number]);
    this.import.emit(this.selected);
  }

  onSelectedChange = (e: any) => {
    this.selected = e;
  }

  rangeChange(range: [Date, Date]): void {
    this.timeRange = range;
  }

  getMinDate = () => parseTimestamp((this.selected && this.selected[0]?.availableRange[0]) || new Date());
  getMaxDate = () => parseTimestamp((this.selected && this.selected[0]?.availableRange[1]) || new Date());
}
