import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { parseTimestamp, dateToTimestamp } from 'src/app/services/deserialization';

@Component({
  selector: 'app-trace-import-modal',
  templateUrl: './trace-import-modal.component.html',
  styleUrls: ['./trace-import-modal.component.css']
})
export class TraceImportModalComponent implements OnInit {

  @Input() show = false;
  @Input() usedIds: string[] = [];

  @Output() toggle = new EventEmitter();
  @Output() import = new EventEmitter<Trace>();

  sources: DataSource[];
  selectedSource: DataSource;
  selectedTrace: Dataset;
  selectedVariant: string;

  id: string;
  title: string;
  timeRange: [Date, Date];

  constructor(private dataClient: DataService) { }

  ngOnInit(): void {
    this.dataClient.getSources().subscribe((s) => {
      this.sources = s;
      this.selectSource(this.sources[0].id);
    });
  }

  onImport(): void {

    if (!this.selectedTrace || this.id.length <= 0 || (this.usedIds && this.usedIds.indexOf(this.id) >= 0)) {
        return;
    }

    this.import.emit({
      id: this.id,
      title: this.title,

      sourceId: this.selectedSource.id,
      datasetId: this.selectedTrace.id,
      variant: this.selectedVariant,

      xRange: this.timeRange.map(dateToTimestamp) as [number, number]
    });
  }

  selectSource = (id: string) => {
    this.selectedSource = this.sources.find(s => s.id === id);
    this.selectTrace(this.selectedSource.datasets[0].id);
  }
  selectTrace = (id: string) => {
    this.selectedTrace = this.selectedSource.datasets.find(d => d.id === id);
    this.selectVariant(this.selectedTrace.variants?.length ? this.selectedTrace.variants[0] : undefined);

    this.timeRange = [ this.getMinDate(), this.getMaxDate() ];
  }
  selectVariant = (variant: string) => {
    this.selectedVariant = variant;

    this.id = this.generateId();
    this.title = this.generateTitle();
  }

  rangeChange(range: [Date, Date]): void {
    this.timeRange = range;
  }

  generateId = () => this.selectedVariant ? `${this.selectedSource.id}:${this.selectedTrace.id}:${this.selectedVariant}` : `${this.selectedSource.id}:${this.selectedTrace.id}`;
  // tslint:disable-next-line: max-line-length
  generateTitle = () => this.selectedVariant ? `${this.selectedTrace.name} (${this.selectedVariant})` : this.selectedTrace.name;

  getAvailableDatasets = () => this.selectedSource?.datasets || [];
  hasVariants = () => this.selectedTrace?.variants?.length > 0;
  getAvailableVariants = () => this.hasVariants() ? this.selectedTrace.variants : [ 'žádné' ];

  getMinDate = () => parseTimestamp(this.selectedTrace.availableXRange[0]);
  getMaxDate = () => parseTimestamp(this.selectedTrace.availableXRange[1]);
}
