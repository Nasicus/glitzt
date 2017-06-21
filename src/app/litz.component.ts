import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { Http } from "@angular/http";

@Component({
  templateUrl: './litz.component.html'
})
export class LitzComponent implements OnInit {
  public litzMessage: string;
  public imageName: string;
  public litzImageIndex: number;

  public constructor(private route: ActivatedRoute, private http: Http) {
  }

  public ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.setMessage(params["name"]);
      this.litzImageIndex = Number(params["litzImageIndex"])
    });
    this.getRandomImage();
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

  private getRandomImage(): void {
    this.http.get("/server/list-all-litzes.php").subscribe(res => {
      let images: string[] = res.json();
      let randomIndex: number = Math.floor(Math.random() * (images.length - 1));
      this.imageName = LitzComponent.isValidIndex(images, this.litzImageIndex)
                         ? images[randomIndex]
                         : images[this.litzImageIndex];
    });
  }

  private static isValidIndex(arr: any[], index: number): boolean {
    return (isNaN(index) || index < 0 || (index > arr.length - 1))
  }
}
