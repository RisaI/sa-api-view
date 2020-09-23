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
  private dataCache: { [hash: string]: [PipelineSpecs, ArrayBuffer] } = {};

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

  async getTraceData(traces: Trace[]): Promise<[PipelineSpecs, ArrayBuffer, Trace][]> {
    const specs = await this.getPipelineSpecs({ pipelines: traces.map(t => t.pipeline) } as PipelineRequest);
    const data = await this.getPipelineData({
      pipelines: traces.map(t => t.pipeline),
      from: traces[0].xRange && String(traces[0].xRange[0]),
      to: traces[0].xRange && String(traces[0].xRange[1]),
    });

    const view = new DataView(data);
    const result: [PipelineSpecs, ArrayBuffer, Trace][] = [];

    let cursor = 0;
    for (let tIdx = 0; tIdx < traces.length; ++tIdx)
    {
      const blockLength = view.getInt32(cursor, true);
      console.log(blockLength);
      result.push([ specs[tIdx], data.slice(cursor + 4, cursor + 4 + blockLength), traces[tIdx]]);

      cursor += 4 + blockLength;
    }

    return result;
  }

  getTraceHash(trace: Trace): string {
    return Md5.hashStr(JSON.stringify(trace.pipeline), false) as string;
  }
}
