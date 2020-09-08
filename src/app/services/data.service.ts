import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, zip } from 'rxjs';
import { shareReplay, first, map, merge } from 'rxjs/operators';
import {Md5} from 'ts-md5/dist/md5';

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

  getPipelineData(pipeline: PipelineRequest): Observable<ArrayBuffer> {
    return this.http.post(
      getApiPath('data'),
      pipeline,
      { responseType: 'arraybuffer' }
    );
  }

  getTraceData(trace: Trace): Observable<[Dataset, ArrayBuffer]> {
    const hash = this.getTraceHash(trace);

    if (!this.dataCache[hash]) {
      this.dataCache[hash] = zip(
          this.getDataset(trace.sourceId, trace.datasetId),
          this.getPipelineData(
            {
              from: trace.xRange && trace.xRange[0],
              to: trace.xRange && trace.xRange[1],
              pipeline: trace.pipeline
            }
          ).pipe(shareReplay(1))
        );
    }

    return this.dataCache[hash];
  }

  getTraceHash(trace: Trace): string {
    return Md5.hashStr(JSON.stringify(trace.pipeline), false) as string;
  }
}
