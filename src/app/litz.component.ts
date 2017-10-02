import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { Http, Response } from "@angular/http";

@Component({
  templateUrl: './litz.component.html',
  styleUrls: ["./litz.component.css"]
})
export class LitzComponent implements OnInit {

  private static facePalmUniCode: string = "🤦";

  public litzMessage: string;
  public imageName: string;
  public name: string;
  public permaLink: string;
  public baseUrl: string;
  public showUploadStuff: boolean;
  
  public constructor(private route: ActivatedRoute, private http: Http) {
  }

  public ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.setMessage(params["name"]);
      let urlImageName: string = params["litzImageName"];
          if (!urlImageName) {
            this.getRandomImage();
          } else {
            this.setImage(urlImageName);
          }
    });
  }

  private setMessage(name?: string): void {
    this.name = name;
    if (name && name != LitzComponent.facePalmUniCode) {
      if (name != "mich") {
        this.litzMessage = `Dä ${this.capitalizeFirstLetter(name)} häts glitzt!`;
      } else {
        this.litzMessage = "Mich häts glitzt!";
      }
    } else {
      this.litzMessage = "S'hät wieder eine glitzt!";
    }

    this.baseUrl = `${document.location.origin}/${this.name || LitzComponent.facePalmUniCode}`;
  }

  private capitalizeFirstLetter(value: string): string {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }

  public getRandomImage(): void {
    this.http
        .get("/server/random-litz.php")
        .subscribe(res => this.setImage(res.json()),
                   error => this.setFallbackImage());
  }

  private setImage(imageName: string) {
    this.imageName = imageName;
    this.permaLink = `${this.baseUrl}/${imageName}`
  }

  private setFallbackImage(): void {
    this.setImage("litz1.gif");
  }
}
