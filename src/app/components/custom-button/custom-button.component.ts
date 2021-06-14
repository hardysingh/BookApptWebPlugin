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
  @Input() public mobile: string;
  @Input() public service: string;
  @Input() public message: string;
  @Input() public hco_id: string;
  @Input() public text: string;

  constructor(public dialog: MatDialog, private gapiService: GoogleApiService) {
    this.gapiService.onLoad().subscribe();
  }

  ngOnInit() {
    console.log('inside on init method');
    console.log(this.hco_id);
  }

  openDialog(): void {
    console.log(this.text);
    const dialogRef = this.dialog.open(ModalComponent, {
      width: '800px',
      height: '95vh',
      data: {hco_id: this.hco_id},
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      this.email = result;
    });
  }

  ngOnChanges() {
    if(this.hco_id) {
      console.log('inside on changes method');
      console.log(this.hco_id);
    }
  }

}
