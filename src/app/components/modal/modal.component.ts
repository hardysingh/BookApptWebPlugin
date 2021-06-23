import { Component, OnInit, Inject, Input, NgZone, TemplateRef, ViewChild, Pipe, PipeTransform } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { GoogleApiService } from 'ng-gapi';
import { NgxSpinnerService } from "ngx-spinner";
import {BreakpointObserver} from '@angular/cdk/layout';
import {MatStepperModule} from '@angular/material/stepper';
import { MatStepper } from '@angular/material/stepper';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';
import { MatDialog, MatDialogClose } from '@angular/material';
import {FlexLayoutModule} from "@angular/flex-layout";
//import {StepperOrientation} from '@angular/material/stepper';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import { DatePipe } from '@angular/common';
const url = 'https://apis.google.com/js/client.js?onload=__onGoogleLoaded';
const gapiOnLoaded = '__onGoogleLoaded';
const clientName = 'gapi';

@Pipe({
  name: 'unique',
  pure: false
})

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
  public availableSlots  = '';
  public todayDate = new Date();
  public secondDate = new Date();
  public thirdDate = new Date();
  public fourthDate = new Date();
  public fifthDate = new Date();
  public sixthDate = new Date();
  public seventhDate = new Date();
  public hcp_id = 0;
  public dateArray = [this.todayDate, this.secondDate.setDate(this.todayDate.getDate() + 1), this.thirdDate.setDate(this.todayDate.getDate() + 2),this.fourthDate.setDate(this.todayDate.getDate() + 3), this.fifthDate.setDate(this.todayDate.getDate() + 4), this.sixthDate.setDate(this.todayDate.getDate() + 5), this.seventhDate.setDate(this.todayDate.getDate() + 6)];
   
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
  public docSelected:boolean = false;
  public defaultImage = '';
  public hco_categories = '';
  public hco_departments = '';
  public hco_medical_conditions = '';
  public hco_promotions = '';
  public hco_services = '';
  public selectedDept = '';
  public selectedDeptID = 0;
  public selectedTime = '0:00';
  public timeSelected:boolean = false;
  public formFilled:boolean = false;
  public chipIndex = 0;
  public docIndex = -1;
  public times_array = [];
  public time_slots = [];
  public hcp_booked_times = [];
  public org_info = {org_name:''};
  public form1_heading = "Select Doctor";
  public form2_heading = "Share your details";
  public apiEndPoint = 'https://wayumd.appspot.com/_ah/api';
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
    private datePipe: DatePipe, private dialog: MatDialog) {

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
  @ViewChild('errorDialog', { static: true }) errorDialog: TemplateRef<any>;
  @ViewChild('innerClose', { static: true }) close: MatDialogClose;
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
      firstCtrl: ['', Validators.required],
      selectedDept: ['', Validators.required]
    });
    this.defaultImage = 'https://wayumd.com/reception/assets/images/doctor_square.svg';
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
    this.secondFormGroup = this._formBuilder.group({
      name: [this.name, [Validators.required, Validators.pattern('[a-zA-Z]+([a-zA-Z ]+)*')]],
      mobile: [this.mobile, [Validators.required, Validators.pattern("[0-9]{0,10}")]],
      country_code: [this.country_code, [Validators.required]],
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
            this.spinner.hide();
            console.log(response.result);
            let data = response.result.care_team || [];
            this.hcpList = data.filter((value, index, self) => self.map(x => x.hcp_id).indexOf(value.hcp_id) == index);
            this.hco_id = this.data.hco_id;
            this.org_info = response.result.clinic_info;
            this.hco_categories =  response.result.hco_categories?response.result.hco_categories:[];
            this.hco_departments =  response.result.hco_departments?response.result.hco_departments:[];
            const mydepartment = this.hco_departments[0];
            this.selectedDept = this.hco_departments[0];
            this.selectedDeptID = response.result.hco_departments[0].dpt_id;
            this.hco_services =  response.result.hco_services?response.result.hco_services:[];
            this.serviceList = response.result.hco_services?response.result.hco_services:[];
            this.spinner.hide();
          })
        });
      return true;
    });

  }

  handleError(error: any) {
    console.error(error);
  }

  openErrorDialog() {
    this.dialog.open(this.errorDialog);
  }

  // fetch slots by date for selected HCP

  public selectDepartment(date, hcp, department){
    this.time_slots = [];
    this.selectedDept = department;
    this.selectedDeptID = department.dpt_id;
    this.selectedHcp = hcp;
    console.log(this.selectedDept);
    this.selectedDate = date;
    this.todayDate = date;
    this.spinner.show();
    this.ngZone.run(() => {
      console.log('sending request to server');
      console.log( this.secondFormGroup);
      const full_name = this.name.split(/ (.*)/);
      const service_object = this.service;
      this.hcp_id = hcp.hcp_id?hcp.hcp_id:0;
      const dataList = {
        hco_id: this.data.hco_id || 0,
        hcp_id: hcp.hcp_id?hcp.hcp_id:0,
        date: this.datePipe.transform(date, 'yyyyMMdd') || '',
        visit_type: 'online',
      }
      console.log(dataList);
      this.gapi.client.websitePlugins.patGetHcpSlotsByDate(dataList).then(
        (response) => {
          this.ngZone.run(() => {
          console.log(response.result);
          this.succeed = false;
          this.slotSelected = true;
          this.docSelected = true;
          this.availableSlots = response.result.hcp_slots;
          this.hcp_booked_times = response.result.hcp_booked_times?response.result.hcp_booked_times:[]
          var start_time = 0,
          end_time = 0,
          interval = '15';

          for (var i=0; i<response.result.hcp_slots.length; i++) {
            console.log('printing hcp slots');
            console.log(response.result.hcp_slots[i]);
            console.log(response.result.hcp_slots[i].dpt_id);
            console.log('selected Department ID');
            console.log(this.selectedDeptID);
            if(response.result.hcp_slots[i].dpt_id === this.selectedDeptID){
              console.log('department ID');
              console.log(response.result.hcp_slots[i].dpt_id);
              var start = new Date(this.selectedDate);
              console.log('after spliting start hours');
              console.log(response.result.hcp_slots[i].start_hours.split(':')[0]);
              console.log('after spliting start hours minutes');
              console.log(response.result.hcp_slots[i].start_hours.split(':')[1]);
              
              start.setHours(parseInt(response.result.hcp_slots[i].start_hours.split(':')[0]) + 5);
              start.setMinutes(parseInt(response.result.hcp_slots[i].start_hours.split(':')[1]) + 30);
              start.setSeconds(0);
              start.setMilliseconds(0);
              console.log('after spliting and adding 5 hours to start hours');
              console.log(parseInt(response.result.hcp_slots[i].start_hours.split(':')[0]) + 5);
              console.log('after spliting start hours adding 30 minutes');
              console.log(parseInt(response.result.hcp_slots[i].start_hours.split(':')[1]) + 30);
              var end = new Date(this.selectedDate);
              end.setHours(parseInt(response.result.hcp_slots[i].end_hours.split(':')[0]) + 5);
              end.setMinutes(parseInt(response.result.hcp_slots[i].end_hours.split(':')[1]) + 30);
              end.setSeconds(0);
              end.setMilliseconds(0);
              var start_hours = start.getHours() + ':' + start.getMinutes();
              console.log('after concating hours to start hours');
              console.log(start_hours);
              
              var end_hours = end.getHours() + ':' + end.getMinutes();
              console.log('after concating end hours');
              console.log(end_hours);
              start_time = this.parseTime(start_hours);
              end_time = this.parseTime(end_hours);
              this.times_array = this.calculate_time_slot( start_time, end_time, interval );
            }
            
           
          }
          console.log('plotting time slots below');
          console.log(this.times_array);
          this.spinner.hide();
          })
        });

    });
  }

  public selectDate(date, hcp, index){
    this.time_slots = [];
    this.chipIndex = index;
    this.selectedHcp = hcp;
    console.log(this.chipIndex);
    this.selectedDate = date;
    this.todayDate = date;
    this.spinner.show();
    this.ngZone.run(() => {
      console.log('sending request to server');
      console.log( this.secondFormGroup);
      const full_name = this.name.split(/ (.*)/);
      const service_object = this.service;
      this.hcp_id = hcp.hcp_id?hcp.hcp_id:0;
      const dataList = {
        hco_id: this.data.hco_id || 0,
        hcp_id: hcp.hcp_id?hcp.hcp_id:0,
        date: this.datePipe.transform(date, 'yyyyMMdd') || '',
        visit_type: 'online',
      }
      console.log(dataList);
      this.gapi.client.websitePlugins.patGetHcpSlotsByDate(dataList).then(
        (response) => {
          this.ngZone.run(() => {
          console.log(response.result);
          this.succeed = false;
          this.slotSelected = true;
          this.docSelected = true;
          this.availableSlots = response.result.hcp_slots;
          this.hcp_booked_times = response.result.hcp_booked_times?response.result.hcp_booked_times:[]
          var start_time = 0,
          end_time = 0,
          interval = '15';

          for (var i=0; i<response.result.hcp_slots.length; i++) {
            console.log('printing hcp slots');
            console.log(response.result.hcp_slots[i]);
            console.log(response.result.hcp_slots[i].dpt_id);
            console.log('selected Department ID');
            console.log(this.selectedDeptID);
            if(response.result.hcp_slots[i].dpt_id === this.selectedDeptID){
              console.log('department ID');
              console.log(response.result.hcp_slots[i].dpt_id);
              var start = new Date(date);
              console.log('after spliting start hours');
              console.log(response.result.hcp_slots[i].start_hours.split(':')[0]);
              console.log('after spliting start hours minutes');
              console.log(response.result.hcp_slots[i].start_hours.split(':')[1]);
              
              start.setHours(parseInt(response.result.hcp_slots[i].start_hours.split(':')[0]) + 5);
              start.setMinutes(parseInt(response.result.hcp_slots[i].start_hours.split(':')[1]) + 30);
              start.setSeconds(0);
              start.setMilliseconds(0);
              console.log('after spliting and adding 5 hours to start hours');
              console.log(parseInt(response.result.hcp_slots[i].start_hours.split(':')[0]) + 5);
              console.log('after spliting start hours adding 30 minutes');
              console.log(parseInt(response.result.hcp_slots[i].start_hours.split(':')[1]) + 30);
              var end = new Date(date);
              end.setHours(parseInt(response.result.hcp_slots[i].end_hours.split(':')[0]) + 5);
              end.setMinutes(parseInt(response.result.hcp_slots[i].end_hours.split(':')[1]) + 30);
              end.setSeconds(0);
              end.setMilliseconds(0);
              var start_hours = start.getHours() + ':' + start.getMinutes();
              console.log('after concating hours to start hours');
              console.log(start_hours);
              
              var end_hours = end.getHours() + ':' + end.getMinutes();
              console.log('after concating end hours');
              console.log(end_hours);
              start_time = this.parseTime(start_hours);
              end_time = this.parseTime(end_hours);
              this.times_array = this.calculate_time_slot( start_time, end_time, interval );
            }
            
           
          }
          console.log('plotting time slots below');
          console.log(this.times_array);
          this.spinner.hide();
          })
        });

    });
  }

  public getAvailableSlots(hcp, index){ 
    this.time_slots = [];
    this.form1_heading = "Select time slot";
    this.selectedHcp = hcp;
    this.hcp_id = hcp.hcp_id?hcp.hcp_id:0;
    this.docIndex = index;
    this.selectedDate = this.todayDate;
    this.spinner.show();
    this.ngZone.run(() => {
      console.log('sending request to server');
      console.log( this.secondFormGroup);
      const full_name = this.name.split(/ (.*)/);
      const service_object = this.service;
      const dataList = {
        hco_id: this.data.hco_id || 0,
        hcp_id: hcp.hcp_id?hcp.hcp_id:0,
        date: this.datePipe.transform(this.todayDate, 'yyyyMMdd') || '',
        visit_type: 'online',
      }
      console.log(dataList);
      this.gapi.client.websitePlugins.patGetHcpSlotsByDate(dataList).then(
        (response) => {
          this.ngZone.run(() => {
          console.log(response.result);
          this.succeed = false;
          this.slotSelected = true;
          this.docSelected = true;
          this.availableSlots = response.result.hcp_slots;
          this.hcp_booked_times = response.result.hcp_booked_times?response.result.hcp_booked_times:[]
          var start_time = 0,
          end_time = 0,
          interval = '15';

          for (var i=0; i<response.result.hcp_slots.length; i++) {
            console.log('printing hcp slots');
            console.log(response.result.hcp_slots[i]);
            console.log(response.result.hcp_slots[i].dpt_id);
            console.log('selected Department ID');
            console.log(this.selectedDeptID);
            if(response.result.hcp_slots[i].dpt_id === this.selectedDeptID){
              console.log('department ID');
              console.log(response.result.hcp_slots[i].dpt_id);
              var start = new Date(this.selectedDate);
              console.log('after spliting start hours');
              console.log(response.result.hcp_slots[i].start_hours.split(':')[0]);
              console.log('after spliting start hours minutes');
              console.log(response.result.hcp_slots[i].start_hours.split(':')[1]);
              
              start.setHours(parseInt(response.result.hcp_slots[i].start_hours.split(':')[0]) + 5);
              start.setMinutes(parseInt(response.result.hcp_slots[i].start_hours.split(':')[1]) + 30);
              start.setSeconds(0);
              start.setMilliseconds(0);
              console.log('after spliting and adding 5 hours to start hours');
              console.log(parseInt(response.result.hcp_slots[i].start_hours.split(':')[0]) + 5);
              console.log('after spliting start hours adding 30 minutes');
              console.log(parseInt(response.result.hcp_slots[i].start_hours.split(':')[1]) + 30);
              var end = new Date(this.selectedDate);
              end.setHours(parseInt(response.result.hcp_slots[i].end_hours.split(':')[0]) + 5);
              end.setMinutes(parseInt(response.result.hcp_slots[i].end_hours.split(':')[1]) + 30);
              end.setSeconds(0);
              end.setMilliseconds(0);
              var start_hours = start.getHours() + ':' + start.getMinutes();
              console.log('after concating hours to start hours');
              console.log(start_hours);
              
              var end_hours = end.getHours() + ':' + end.getMinutes();
              console.log('after concating end hours');
              console.log(end_hours);
              start_time = this.parseTime(start_hours);
              end_time = this.parseTime(end_hours);
              this.times_array = this.calculate_time_slot( start_time, end_time, interval );
            }
            
           
          }
          console.log('plotting time slots below');
          console.log(this.times_array);
          this.spinner.hide();
          })
        });

    });
  }

  public selectSlot(time, stepper: MatStepper){
    this.slotSelected = true;
    console.log('selected time');
    console.log(time);
    this.selectedTime = time;
    this.docSelected = true;
    this.timeSelected = true;
    this.formFilled = false;
    //this.selectedTime = this.datePipe.transform(time, 'hh:mm a') ;
    stepper.next();  
  }

  public submitForm(){
    this.ngZone.run(() => {
    this.slotSelected = true;
    this.docSelected = true;
    this.timeSelected = true;
    this.formFilled = true;
    this.form2_heading = "Review";
    })
  }

  public parseTime(s) {
    var c = s.split(':');
    return parseInt(c[0]) * 60 + parseInt(c[1]);
  }

  public convertHours(mins){
    var hour = Math.floor(mins/60);
    var minutes = mins%60;
    var converted = this.pad(hour, 2)+':'+this.pad(minutes, 2);
    return converted;
  }
  
  public pad (str, max) {
    str = str.toString();
    return str.length < max ? this.pad("0" + str, max) : str;
  }
  
  public calculate_time_slot(start_time, end_time, intervals){
    console.log('time start');
    console.log(start_time);
    console.log('time end');
    console.log(end_time);
    var i, formatted_time;
    //var time_slots = new Array();
   
    for(var i=start_time; i<=end_time; i = i+15){
      formatted_time = this.convertHours(i);
      var dt = new Date(this.selectedDate);
      var selectedDateTime = new Date(this.selectedDate);
      dt.setHours(parseInt(formatted_time.split(':')[0]));
      dt.setMinutes(parseInt(formatted_time.split(':')[1]));
      dt.setSeconds(0);
      dt.setMilliseconds(0);
      let scheduleTime = {time:dt.getTime(), booked:false};
     
      for(var j=0; j < this.hcp_booked_times.length; j++)
      {
          console.log('time comparison time');
          console.log(scheduleTime)
          console.log('time comparison booked time')
          console.log(this.hcp_booked_times[j].start_time)
          if(this.hcp_booked_times[j].start_time == scheduleTime.time){
            scheduleTime.booked = true;
          } 
      }
      if(scheduleTime.time < selectedDateTime.getTime()){
        scheduleTime.booked = true;
      }
      console.log('after calculating time for slots');
      console.log(scheduleTime);
      this.time_slots.push(scheduleTime);
      console.log('time slots');
      console.log(this.time_slots);
    }
    return this.time_slots;
  }

  public onSaveform(stepper: MatStepper): void {
    this.markAsDirty(this.secondFormGroup);
    this.spinner.show();
    this.ngZone.run(() => {
      console.log('sending request to server');
      console.log('selected time print');
      console.log(this.selectedTime);
      console.log( this.secondFormGroup);
      const full_name = this.name.split(/ (.*)/);
      const service_object = this.service;
      var dt = new Date(this.selectedDate);
      // dt.setHours(parseInt(this.selectedTime.split(':')[0]));
      // dt.setMinutes(parseInt(this.selectedTime.split(':')[1]));
      // dt.setSeconds(0);
      // dt.setMilliseconds(0);
      // console.log('converted date');
      // console.log(dt);
      // const scheduleTime = dt.getTime();
      const dataList = {
        first_name: full_name[0],
        last_name: full_name[1] || '',
        mobile: this.country_code+this.mobile || '',
        service_name: service_object.service_name || '',
        serv_id: service_object.serv_id || '',
        description: service_object.service_name?service_object.service_name:'',
        appt_date: this.datePipe.transform(this.selectedDate, 'yyyyMMdd') || '',
        time_slot: this.selectedTime?this.selectedTime:'00:00',
        hcp_id:this.hcp_id?this.hcp_id:0,
        scheduled_time: this.selectedTime?this.selectedTime:'00:00',
        service_options:'',
        consultation_notes: this.message?this.message:'',
        files:'',
        dpt_id: this.selectedDeptID?this.selectedDeptID:0,
        hco_id: this.hco_id || 0,
        remote_session:false
      }
      console.log(dataList);
      this.gapi.client.websitePlugins.patBookApptSlot(dataList).then(
        (response) => {
          this.ngZone.run(() => {
          console.log(response.result);
          this.form1_heading = "Select Doctor";
          this.form2_heading = "Share your details";
          this.succeed = true;
          stepper.next();
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