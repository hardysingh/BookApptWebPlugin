import { Component, OnInit, Inject, Input, NgZone } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { GoogleApiService } from 'ng-gapi';
import { NgxSpinnerService } from "ngx-spinner";
import {BreakpointObserver} from '@angular/cdk/layout';
import {MatStepperModule} from '@angular/material/stepper';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';
//import {StepperOrientation} from '@angular/material/stepper';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import { DatePipe } from '@angular/common';
const url = 'https://apis.google.com/js/client.js?onload=__onGoogleLoaded';
const gapiOnLoaded = '__onGoogleLoaded';
const clientName = 'gapi';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css'],
  providers:[DatePipe]
})

export class ModalComponent implements OnInit {
  //stepperOrientation: Observable<StepperOrientation>;
  public breakpoint: number; // Breakpoint observer code
  public name: string = '';
  public mobile: string = '';
  public country_code: string = '';
  public service = {service_name:'', serv_id:0};
  public service_name: string = '';
  public serv_id = 0;
  public message: string = '';
  public email: string = '';
  public hco_id: string = '0';
  public serviceList = [];
  public hcpList = [];
  public todayDate = new Date();
  public dateArray = [this.todayDate, this.todayDate.getDate() + 1, this.todayDate.getDate() + 2, this.todayDate.getDate() + 3, this.todayDate.getDate() + 4, this.todayDate.getDate() + 5, this.todayDate.getDate() + 6];
  public selectedCode = '+91';
  public countryCodes = [{
    'name': 'Afghanistan',
    'code': '+93'
  },
  {
    'name': 'Argentina',
    'code': '+54'
  },
  {
    'name': 'Australia',
    'code': '+61'
  },
  {
    'name': 'Bahrain',
    'code': '+973'
  },
  {
    'name': 'Bangladesh',
    'code': '+880'
  },
  {
    'name': 'Bhutan',
    'code': '+975'
  },
  {
    'name': 'Brazil',
    'code': '+55'
  },
  {
    'name': 'Brunei',
    'code': '+673'
  },
  {
    'name': 'Canada',
    'code': '+1'
  },
  {
    'name': 'Chile',
    'code': '+56'
  },
  {
    'name': 'Colombia',
    'code': '+57'
  },
  {
    'name': 'Ecuador',
    'code': '+593'
  },
  {
    'name': 'Fiji',
    'code': '+679'
  },
  {
    'name': 'France',
    'code': '+33'
  },
  {
    'name': 'Germany',
    'code': '+49'
  },
  {
    'name': 'India',
    'code': '+91'
  },
  {
    'name': 'Indonesia',
    'code': '+62'
  },
  {
    'name': 'Ireland',
    'code': '+353'
  },
  {
    'name': 'Japan',
    'code': '+81'
  },
  {
    'name': 'Kenya (Former British East Africa)',
    'code': '+254'
  },
  {
    'name': 'Malaysia',
    'code': '+60'
  },
  {
    'name': 'Maldives',
    'code': '+960'
  },
  {
    'name': 'Mauritius',
    'code': '+230'
  },
  {
    'name': 'Mexico',
    'code': '+52'
  },
  {
    'name': 'Nepal',
    'code': '+977'
  },
  {
    'name': 'New Zealand',
    'code': '+64'
  },
  {
    'name': 'Oman',
    'code': '+968'
  },
  {
    'name': 'Pakistan',
    'code': '+92'
  },
  {
    'name': 'Qatar',
    'code': '+974'
  },
  {
    'name': 'Singapore',
    'code': '+65'
  },
  {
    'name': 'Spain',
    'code': '+34'
  },
  {
    'name': 'Sri Lanka',
    'code': '+94'
  },
  {
    'name': 'United Arab Emirates',
    'code': '+971'
  },
  {
    'name': 'United Kingdom (Great Britain / UK)',
    'code': '+44'
  },
  {
    'name': 'United States',
    'code': '+1'
  }, {
    'name': 'Uganda',
    'code': '+14'
  }
  ];
  public selectedHcp = '';
  public selectedDate = new Date();
  
  public succeed:boolean = false;
  public slotSelected:boolean = false;

  public contactForm: FormGroup;
  public apiEndPoint = 'https://wayuconnectdev.appspot.com/_ah/api';
  wasFormChanged = false;
  private gapi: any;
  private loadAPI: Promise<any>;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  constructor(
    public dialogRef: MatDialogRef<ModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder,
    private gapiService: GoogleApiService, private ngZone: NgZone,
    private spinner: NgxSpinnerService, breakpointObserver: BreakpointObserver, private _formBuilder: FormBuilder,
    private datePipe: DatePipe) {

      //this.stepperOrientation = breakpointObserver.observe('(min-width: 800px)')
      //.pipe(map(({matches}) => matches ? 'horizontal' : 'vertical'));

    this.loadAPI = new Promise((resolve) => {
      window[gapiOnLoaded] = (ev) => {
        this.gapi = window[clientName];
        // Loads the OAuth and other APIs asynchronously, and triggers login
        // when they have completed.
        let apisToLoad;
        let callback = function () {
          console.log('loading apis');
          if (--apisToLoad === 0) {
            resolve(window[clientName]);
          }
        };
        apisToLoad = 1; // must match number of calls to gapi.client.load()
        this.gapi.client.load('websitePlugins', 'v1', callback, this.apiEndPoint);
      };
      this.loadScript();
    });

  }
  public GetClient(): any {
    return this.loadAPI.then((res) => {
      console.log('getting client');
      console.log(this.gapi);
      return this.gapi;
    });
  }

  private loadScript() {
    let node = document.createElement('script');
    node.src = url;
    node.type = 'text/javascript';
    document.getElementsByTagName('head')[0].appendChild(node);
  }

  onNoClick(): void {
    console.log('close clicked');
    this.dialogRef.close();

  }

  public ngOnInit(): void {
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required]
    });
    // this.secondFormGroup = this._formBuilder.group({
    //   secondCtrl: ['', Validators.required]
    // });
    /** spinner starts on init */
    // this.breakpoint = (window.innerWidth <= 400) ? 1 : 3;
    this.breakpoint = window.innerWidth <= 600 ? 1 : 2; // Breakpoint observer code
    console.log(this.data)
    this.spinner.show();
    this.succeed = false;
    this.country_code = '+91';
    this.secondFormGroup = this.fb.group({
      name: [this.name, [Validators.required, Validators.pattern('[a-zA-Z]+([a-zA-Z ]+)*')]],
      mobile: [this.mobile, [Validators.required, Validators.pattern("[0-9]{0,10}")]],
      country_code: [this.country_code, [Validators.required]],
      email: [this.email, [Validators.pattern('[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,3}')]],
      service: [this.service],
      service_name: [this.service_name],
      serv_id: [this.serv_id],
      message: [this.message, [Validators.required]],
    });
    
    this.GetClient().then((gapi) => {
      console.log('getting client confuguration');
      console.log(gapi);
      this.gapi = gapi;
      this.gapi.client.websitePlugins.patFetchClinicInfo({hco_id:this.data.hco_id || 0}).then(
        (response) => {
          this.ngZone.run(() => {
            console.log('fetch clinic info result');
            console.log(response.result);
            this.hcpList = response.result.care_team || [];
            this.hco_id = this.data.hco_id;
            this.spinner.hide();
          })
        });
      return true;
    });

  }

  handleError(error: any) {
    console.error(error);
  }

  // fetch slots by date for selected HCP

  public selectDate(date, hcp){
    this.selectedDate = date;
    this.selectedDate = this.todayDate;
    this.spinner.show();
    this.ngZone.run(() => {
      console.log('sending request to server');
      console.log( this.contactForm);
      const full_name = this.name.split(/ (.*)/);
      const service_object = this.service;
      const dataList = {
        hco_id: this.data.hco_id || 0,
        hcp_id: hcp.hcp_id?hcp.hcp_id:0,
        date: this.email || '',
        visit_type: 'online',
      }
      console.log(dataList);
      this.gapi.client.websitePlugins.patGetHcpSlotsByDate(dataList).then(
        (response) => {
          this.ngZone.run(() => {
          console.log(response.result);
          this.succeed = true;
          this.spinner.hide();
          })
        });

    });
  }

  public getAvailableSlots(hcp){ 
    this.selectedHcp = hcp;
    this.selectedDate = this.todayDate;
    this.spinner.show();
    this.ngZone.run(() => {
      console.log('sending request to server');
      console.log( this.contactForm);
      const full_name = this.name.split(/ (.*)/);
      const service_object = this.service;
      const dataList = {
        hco_id: this.data.hco_id || 0,
        hcp_id: hcp.hcp_id?hcp.hcp_id:0,
        date: this.email || '',
        visit_type: 'online',
      }
      console.log(dataList);
      this.gapi.client.websitePlugins.patGetHcpSlotsByDate(dataList).then(
        (response) => {
          this.ngZone.run(() => {
          console.log(response.result);
          this.succeed = true;
          this.spinner.hide();
          })
        });

    });
  }

  public onSaveform(): void {
    this.markAsDirty(this.contactForm);
    this.spinner.show();
    this.ngZone.run(() => {
      console.log('sending request to server');
      console.log( this.contactForm);
      const full_name = this.name.split(/ (.*)/);
      const service_object = this.service;
      const dataList = {
        first_name: full_name[0],
        last_name: full_name[1] || '',
        email: this.email || '',
        mobile: this.country_code+this.mobile || '',
        service_name: service_object.service_name || '',
        serv_id: service_object.serv_id || '',
        message: this.message || '',
        hco_id: this.hco_id || 0
      }
      console.log(dataList);
      this.gapi.client.websitePlugins.patHCOEnquiry(dataList).then(
        (response) => {
          this.ngZone.run(() => {
          console.log(response.result);
          this.succeed = true;
          this.spinner.hide();
          })
        });

    });
    console.log('the gapi request called with save button');

  }

  // tslint:disable-next-line:no-any
  public onResize(event: any): void {
    this.breakpoint = event.target.innerWidth <= 600 ? 1 : 2;
    // this.breakpoint = (event.target.innerWidth <= 400) ? 1 : 3;
  }

  private markAsDirty(group: FormGroup): void {
    group.markAsDirty();
    // tslint:disable-next-line:forin
    for (const i in group.controls) {
      group.controls[i].markAsDirty();
    }
  }

  formChanged() {
    this.wasFormChanged = true;
  }
}