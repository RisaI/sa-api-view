import {Component, OnInit, Output, EventEmitter, Input} from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {

  @Input() layoutUnlocked: boolean;

  @Output() toggleLock = new EventEmitter();
  @Output() addGraph = new EventEmitter();

  constructor() {

  }

  ngOnInit(): void {
    return;
  }

}
