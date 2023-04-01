import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PortfolioComponent } from './components/portfolio/portfolio.component';
import {MatCardModule} from "@angular/material/card";
import { ThreeJSComponentComponent } from './components/three-jscomponent/three-jscomponent.component';

@NgModule({
  declarations: [
    AppComponent,
    PortfolioComponent,
    ThreeJSComponentComponent
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        MatCardModule
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
