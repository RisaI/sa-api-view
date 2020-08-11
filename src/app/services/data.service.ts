import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, zip } from 'rxjs';
import { shareReplay, first, map, merge } from 'rxjs/operators';

const getApiPath = (...segments: string[]) => '/api/v2/' + segments.join('/');

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private sources: Observable<DataSource[]> | undefined = undefined;
  private dataCache: { [hash: string]: Observable<[Dataset, ArrayBuffer]> } = {};

  constructor(private http: HttpClient) { }

  getSources(): Observable<DataSource[]> {
    if (this.sources) {
      return this.sources;
    }

    return this.sources = this.http.get<DataSource[]>(getApiPath('data')).pipe(
      shareReplay(1)
    );
  }

  getDataset(source: string, dataset: string): Observable<Dataset> {
    return this.getSources().pipe(
      map(sources => sources.find(s => s.id === source).datasets.find(d => d.id === dataset)),
      first()
    );
  }

  getDataSetData(id: Dataset | string, source?: string, variant?: string, from?: any, to?: any): Observable<ArrayBuffer> {
    let query = '';

    if (from !== undefined && to !== undefined) {
        query = `?from=${from}&to=${to}`;
    } else if (from !== undefined) {
        query = `?from=${from}`;
    } else if (to !== undefined) {
        query = `?to=${to}`;
    }

    if (variant) {
        if (query === '') {
            query = `?variant=${variant}`;
        } else {
            query += `&variant=${variant}`;
        }
    }

    return this.http.get(
      getApiPath('data', ...(typeof id === 'string' ? [ source as string, id ] : [ id.source, id.id ]), 'data') + query,
      { responseType: 'arraybuffer' }
    );
  }

  getTraceData(trace: Trace): Observable<[Dataset, ArrayBuffer]> {
    const hash = this.getTraceHash(trace);

    if (!this.dataCache[hash]) {
      this.dataCache[hash] = zip(
          this.getDataset(trace.sourceId, trace.datasetId),
          this.getDataSetData(
            trace.datasetId,
            trace.sourceId,
            trace.variant,
            trace.xRange && trace.xRange[0],
            trace.xRange && trace.xRange[1]
          ).pipe(shareReplay(1))
        );
    }

    return this.dataCache[hash];
  }

  getTraceHash(trace: Trace): string {
    return `${trace.sourceId}:${trace.datasetId}:${trace.variant || ''}:${trace.xRange && trace.xRange[0]}:${trace.xRange && trace.xRange[1]}`;
  }
}
