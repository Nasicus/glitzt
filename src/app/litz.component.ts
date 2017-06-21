import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { Http, Response } from "@angular/http";

@Component({
  templateUrl: './litz.component.html'
})
export class LitzComponent implements OnInit {

  public litzMessage: string;
  public imageName: string;
  public name: string;
  public litzImageIndex: number;
  public permaLink: string;

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
    this.name = name;
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
    this.http
        .get("/server/list-all-litzes.php")
        .subscribe(res => this.onGetRandomImageSuccess(res),
                   error => this.setFallbackImage());
  }

  private onGetRandomImageSuccess(res: Response): void {
    let images: string[];
    try {
      images = res.json();
    } catch (ex) {
      this.setFallbackImage();
      return;
    }

    let randomIndex: number = Math.floor(Math.random() * (images.length - 1));
    let actualIndex: number = LitzComponent.isValidIndex(images, this.litzImageIndex)
                                ? randomIndex
                                : this.litzImageIndex;

    this.imageName = images[actualIndex];
    this.tryBuildPermaLink(actualIndex);
  }

  private tryBuildPermaLink(imageIndex: number): void {
    if (this.name) {
      this.permaLink = `${document.location.origin}/${this.name}/${imageIndex}`
    }  
  }

  private setFallbackImage(): void {
    this.imageName = "litz1.gif";
  }

  private static isValidIndex(arr: any[], index: number): boolean {
    return (isNaN(index) || index < 0 || (index > arr.length - 1))
  }
}
