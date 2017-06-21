import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule, JsonpModule } from "@angular/http";

import { AppComponent } from './app.component';
import { LitzComponent } from './litz.component';
import { GithubForkComponent } from './github-fork.component';
import { AppRoutingModule } from "./app-routing.module";

@NgModule({
  declarations: [
    AppComponent,
    LitzComponent,
    GithubForkComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpModule,
    JsonpModule,
  ],
  exports: [
    LitzComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
