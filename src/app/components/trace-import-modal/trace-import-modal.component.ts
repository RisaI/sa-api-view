import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DataService } from 'src/app/services/data.service';

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
  from: Date;
  to: Date;

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

      xRange: [ Math.floor(this.from.getTime() / 1000), Math.floor(this.to.getTime() / 1000) ]
    });
  }

  selectSource = (id: string) => {
    this.selectedSource = this.sources.find(s => s.id === id);
    this.selectTrace(this.selectedSource.datasets[0].id);
  }
  selectTrace = (id: string) => {
    this.selectedTrace = this.selectedSource.datasets.find(d => d.id === id);
    this.selectVariant(this.selectedTrace.variants?.length ? this.selectedTrace.variants[0] : undefined);

    this.from = new Date(this.selectedTrace.availableXRange[0] * 1000);
    this.to = new Date(this.selectedTrace.availableXRange[1] * 1000);
  }
  selectVariant = (variant: string) => {
    this.selectedVariant = variant;

    this.id = this.generateId();
    this.title = this.generateTitle();
  }

  generateId = () => this.selectedVariant ? `${this.selectedSource.id}:${this.selectedTrace.id}:${this.selectedVariant}` : `${this.selectedSource.id}:${this.selectedTrace.id}`;
  // tslint:disable-next-line: max-line-length
  generateTitle = () => this.selectedVariant ? `${this.selectedTrace.name} (${this.selectedVariant})` : this.selectedTrace.name;

  getAvailableDatasets = () => this.selectedSource?.datasets || [];
  hasVariants = () => this.selectedTrace?.variants?.length > 0;
  getAvailableVariants = () => this.hasVariants() ? this.selectedTrace.variants : [ 'žádné' ];
}