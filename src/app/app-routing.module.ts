import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { AppComponent } from "./app.component";
import { LitzComponent } from './litz.component';

const routes: Routes = [
  {
    path: ":name",
    component: LitzComponent
  },
  {
    path: "**",
    component: LitzComponent,
  }
];

@NgModule({
              imports: [
                  RouterModule.forRoot(routes)
              ],
              exports: [
                  RouterModule
              ]
          })
export class AppRoutingModule {
}
