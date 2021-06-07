import {Component, Input, OnInit} from '@angular/core';
import { GoogleApiService } from 'ng-gapi';

@Component({
  selector: 'app-custom-header',
  templateUrl: './custom-header.component.html',
  styleUrls: ['./custom-header.component.css']
})
export class CustomHeaderComponent implements OnInit {
  @Input() public title: string;

  constructor(private gapiService: GoogleApiService) {
    this.gapiService.onLoad().subscribe();
  }

  ngOnInit() {
    console.log(this.title);
  }

}
