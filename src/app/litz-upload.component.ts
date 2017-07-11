import { Component, Input } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { Http, Response } from "@angular/http";

@Component({
  selector: 'litz-upload',
  templateUrl: './litz-upload.component.html'
})
export class LitzUploadComponent {
  public maxFileSizeMb: number = 12;
  public maxFileSizeByte: number = this.maxFileSizeMb * 1024 * 1024;

  public uploadLinks: {originalName: string, permaLink: string}[] = [];

  @Input()
  public baseUrl: string;

  public onUploadFinished(data: any): void {
    let newImageName: string = (<any>data.serverResponse)._body;
    let permaLink: string = `${this.baseUrl}/${newImageName}`;

    this.uploadLinks.push({originalName: data.file.name, permaLink: permaLink});
  }
}
