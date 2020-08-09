import {Component, OnInit, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {

  @Output() changeOrientation = new EventEmitter();
  @Output() addGraph = new EventEmitter();

  constructor() {

  }

  ngOnInit(): void {
    return;
  }

}
