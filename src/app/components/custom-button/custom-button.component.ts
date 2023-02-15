import {Component, Input, OnInit} from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { ModalComponent } from '../modal/modal.component';
import { GoogleApiService } from 'ng-gapi';


@Component({
  selector: 'app-custom-button',
  templateUrl: './custom-button.component.html',
  styleUrls: ['./custom-button.component.css']
})
export class CustomButtonComponent implements OnInit {
  @Input() public email: string;
  @Input() public name: string;
  @Input() options: {
    hco_id: string,
    buttonText: string,
    buttonColor: string,
    title: string,
};
  allOptions: any;
  buttonOptions: any;

  constructor(public dialog: MatDialog, private gapiService: GoogleApiService) {
    this.gapiService.onLoad().subscribe();
  }

  ngOnInit() {
    console.log('inside on init method');
    console.log('Options print');
    this.allOptions = this.options;
    this.buttonOptions = JSON.parse(this.allOptions);
    console.log(this.options);
    console.log('before converting into object');
    console.log(this.buttonOptions);
    console.log('After converting into object');
    console.log(this.buttonOptions);
   
  }

  openDialog(): void {
    console.log(this.buttonOptions.buttonText);
    const dialogRef = this.dialog.open(ModalComponent, {
      width: '768px',
      //height: '70vh',
      data: {hco_id: this.buttonOptions.hco_id , title: this.buttonOptions.title, buttonText : this.buttonOptions.buttonText},
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      this.email = result;
    });
  }

  ngOnChanges() {
    if(this.options) {
      this.allOptions = this.options;
      this.buttonOptions = JSON.parse(this.allOptions);
      console.log(this.options);
      console.log('inside on changes method');
      console.log(this.buttonOptions);
      console.log(this.buttonOptions.hco_id);
    }
  }

}
