import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { LitzComponent } from './litz.component';
import { AppRoutingModule } from "./app-routing.module";

@NgModule({
  declarations: [
    AppComponent,
    LitzComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  exports: [
    LitzComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
