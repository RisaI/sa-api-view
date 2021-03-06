import {Component, OnInit, Output, EventEmitter, Input} from '@angular/core';
import { faLock, faUnlock, faPlus } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {

  faLock = faLock;
  faUnlock = faUnlock;
  faPlus = faPlus;

  @Input() layoutUnlocked: boolean;

  @Output() toggleLock = new EventEmitter();
  @Output() addGraph = new EventEmitter();

  constructor() {

  }

  ngOnInit(): void {
    return;
  }

}
