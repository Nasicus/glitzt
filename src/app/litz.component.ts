import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";

@Component({
  templateUrl: './litz.component.html'
})
export class LitzComponent implements OnInit {
  public litzMessage: string;

  public constructor(private route: ActivatedRoute) {
  }

  public ngOnInit(): void {
    this.route.params.subscribe(params => this.setMessage(params["name"]));
  }

  private setMessage(name?: string): void {
    if (name) {
      if (name != "mich") {
        this.litzMessage = `Dä ${this.capitalizeFirstLetter(name)} häts glitzt!`;
      } else {
        this.litzMessage = "Mich häts glitzt!";
      }
    } else {
      this.litzMessage = "S'hät wieder eine glitzt!";
    }
  }

  private capitalizeFirstLetter(value: string): string {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }
}
