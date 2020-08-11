import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ControlsService {

  public zoomSync = new EventEmitter<Graph['zoom']>();

  constructor() { }

  performZoomSync(zoom: Graph['zoom']): void {
    this.zoomSync.emit(zoom);
  }
}
