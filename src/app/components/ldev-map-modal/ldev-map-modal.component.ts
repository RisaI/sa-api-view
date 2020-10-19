import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { TreeviewItem } from 'ngx-treeview';
import { DataService } from 'src/app/services/data.service';
import { parseTimestamp, dateToTimestamp } from 'src/app/services/deserialization';

type CTrace = Trace & { availableRange: [any, any], xtype: string, variants?: string[] };

@Component({
  selector: 'app-ldev-map-modal',
  templateUrl: './ldev-map-modal.component.html',
  styleUrls: ['./ldev-map-modal.component.css']
})
export class LdevMapModalComponent implements OnInit, OnChanges {

  @Input() show = false;
  @Input() sourceId: string;
  @Input() ldevId: string;

  @Output() toggle = new EventEmitter();

  ldevInfo: LdevInfo;

  constructor(private dataClient: DataService) { }

  ngOnInit(): void {

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.ldevId && changes.ldevId.currentValue && changes.ldevId.currentValue !== changes.ldevId.previousValue) {
      this.dataClient.getLdevMap(this.sourceId, this.ldevId).then(ldev => this.ldevInfo = ldev);
    }
  }

  getHostgroups = () => this.ldevInfo.hostPorts.map(hp => hp.hostgroup).filter((v, i, a) => a.indexOf(v) === i);
  getPorts = (hostgroup: string) => this.ldevInfo.hostPorts.filter(v => v.hostgroup === hostgroup);
  getWwns = (hostport: HostPort) => this.ldevInfo.wwns.filter(w => w.hostgroup === hostport.hostgroup && w.port === hostport.port);
}
