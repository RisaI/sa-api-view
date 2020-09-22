import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Md5} from 'ts-md5/dist/md5';

const getApiPath = (...segments: string[]) => '/api/v2/' + segments.join('/');

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private sources: DataSource[] | undefined = undefined;
  private dataCache: { [hash: string]: [PipelineSpecs, ArrayBuffer] } = {};

  constructor(private http: HttpClient) { }

  async getSources(): Promise<DataSource[]> {
    if (this.sources) {
      return this.sources;
    }

    return this.sources = await this.http.get<DataSource[]>(getApiPath('data')).toPromise();
  }

  async getPipelineSpecs(pipeline: PipelineRequest): Promise<PipelineSpecs> {
    return await this.http.post<PipelineSpecs>(
      getApiPath('data', 'specs'),
      pipeline
    ).toPromise();
  }

  async getPipelineData(pipeline: PipelineRequest): Promise<ArrayBuffer> {
    return await this.http.post(
      getApiPath('data'),
      pipeline,
      { responseType: 'arraybuffer' }
    ).toPromise();
  }

  async getTraceData(trace: Trace): Promise<[PipelineSpecs, ArrayBuffer, Trace]> {
    const hash = this.getTraceHash(trace);

    if (!this.dataCache[hash]) {
      this.dataCache[hash] = await Promise.all([
          this.getPipelineSpecs({ pipeline: trace.pipeline } as PipelineRequest),
          this.getPipelineData(
            {
              from: trace.xRange && String(trace.xRange[0]),
              to: trace.xRange && String(trace.xRange[1]),
              pipeline: trace.pipeline
            }
          )
        ]);
    }

    return [ ...this.dataCache[hash], trace ];
  }

  getTraceHash(trace: Trace): string {
    return Md5.hashStr(JSON.stringify(trace.pipeline), false) as string;
  }
}
