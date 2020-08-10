import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';

import { HeaderComponent } from './components/header/header.component';
import { SideMenuComponent } from './components/side-menu/side-menu.component';
import { TraceControlsComponent } from './components/trace-controls/trace-controls.component';
import { TraceListComponent } from './components/trace-list/trace-list.component';
import { GraphViewComponent } from './components/graph-view/graph-view.component';
import { DataService } from './services/data.service';
import { TraceImportModalComponent } from './components/trace-import-modal/trace-import-modal.component';

import * as PlotlyJS from 'plotly.js/dist/plotly.js';
import { PlotlyModule } from 'angular-plotly.js';
import { SizeMeModule } from 'ngx-size-me';

PlotlyModule.plotlyjs = PlotlyJS;

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SideMenuComponent,
    TraceControlsComponent,
    TraceListComponent,
    GraphViewComponent,
    TraceImportModalComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    PlotlyModule,
    SizeMeModule,
  ],
  providers: [
    DataService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
