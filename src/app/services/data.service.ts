import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { shareReplay, first, map } from 'rxjs/operators';

const getApiPath = (...segments: string[]) => '/api/v2/' + segments.join('/');

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private sources: Observable<DataSource[]> | undefined = undefined;

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
      first(),
      map(sources => sources.find(s => s.id === source).datasets.find(d => d.id === dataset))
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
}
