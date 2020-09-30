import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Md5} from 'ts-md5/dist/md5';
import { deserializers } from './deserialization';

const getApiPath = (...segments: string[]) => '/api/v2/' + segments.join('/');

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private sources: DataSource[] | undefined = undefined;
  private dataCache: { [hash: string]: { specs: PipelineSpecs, loadedSegments: [ any, any, ArrayBuffer ][] } } = {};

  constructor(private http: HttpClient) { }

  async getSources(): Promise<DataSource[]> {
    if (this.sources) {
      return this.sources;
    }

    return this.sources = await this.http.get<DataSource[]>(getApiPath('data')).toPromise();
  }

  async getPipelineSpecs(pipeline: PipelineRequest): Promise<PipelineSpecs[]> {
    return await this.http.post<PipelineSpecs[]>(
      getApiPath('data', 'specs'),
      pipeline
    ).toPromise();
  }

  async getPipelineData(request: PipelineRequest): Promise<ArrayBuffer> {
    return await this.http.post(
      getApiPath('data'),
      request,
      { responseType: 'arraybuffer' }
    ).toPromise();
  }

  async getTraceData(from: any, to: any, traces: Trace[]): Promise<[ PipelineSpecs, DataView, Trace ][]> {

    const cached = traces.filter(t => {
      const h = this.getTraceHash(t);
      return this.dataCache[h] && this.dataCache[h].loadedSegments.some(seg => seg[0] <= from && seg[1] >= to);
    });
    const uncached = traces.filter(t => !cached.includes(t));

    if (uncached.length > 0)
    {
      const specs = await this.getPipelineSpecs({ pipelines: uncached.map(t => t.pipeline) } as PipelineRequest);
      const data = await this.getPipelineData({
        pipelines: uncached.map(t => t.pipeline), from: String(from), to: String(to),
      });

      {
        const view = new DataView(data);
        let cursor = 0;
        for (let tIdx = 0; tIdx < uncached.length; ++tIdx)
        {
          const hash = this.getTraceHash(uncached[tIdx]);
          const cacheEntry = this.dataCache[hash] || (this.dataCache[hash] = {
            specs: specs[tIdx],
            loadedSegments: []
          });

          const blockLength = view.getInt32(cursor, true);
          cacheEntry.loadedSegments.push([
            from,
            to,
            data.slice(cursor + 4, cursor + 4 + blockLength)
          ]);
          // TODO: segment merging

          cursor += 4 + blockLength;
        }
      }
    }

    return traces.map(t => {
      const entry = this.dataCache[this.getTraceHash(t)];
      const segment = entry.loadedSegments.find(seg => from >= seg[0] && to <= seg[1]);

      // TODO: view narrowing

      return [ entry.specs, new DataView(segment[2]), t];
    });
  }

  getTraceHash(trace: Trace & { hash?: string }): string {
    return trace.hash || (trace.hash = Md5.hashStr(JSON.stringify(trace.pipeline), false) as string);
  }
}
