import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule, JsonpModule } from "@angular/http";

import { AppComponent } from './app.component';
import { LitzComponent } from './litz.component';
import { LitzUploadComponent } from './litz-upload.component';
import { GithubForkComponent } from './github-fork.component';
import { AppRoutingModule } from "./app-routing.module";
import {ImageUploadModule} from "angular2-image-upload";

@NgModule({
  declarations: [
    AppComponent,
    LitzComponent,
    LitzUploadComponent,
    GithubForkComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpModule,
    JsonpModule,
    ImageUploadModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
