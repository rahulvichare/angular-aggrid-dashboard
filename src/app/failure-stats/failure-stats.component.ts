import { Component, HostListener, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { RestserviceService } from '../restservice.service';
import { config, environment } from 'src/environments/environment';
import { Subject } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { CellCustomComponent } from '../cell-custom/cell-custom.component';
import { NgbModal, ModalDismissReasons, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import * as CryptoJS from 'crypto-js';
import { interval, Subscription } from 'rxjs';

declare var $: any;
//export let browserRefresh = false;
export var logdates = {
  logstartDate: "",
  logendDate: "",
  logdashboardname: ""
};

@Component({
  selector: 'app-failure-stats',
  templateUrl: './failure-stats.component.html',
  styleUrls: ['./failure-stats.component.css']
})
export class FailureStatsComponent implements OnInit {
  private gridApi;
  private gridColumnApi;
  public columnDefs = [];
  private columnDefs1 = [];
  private sortingOrder;
  public defaultColDef;
  public browserRefresh: boolean;
  userActivity;
  userInactive: Subject<any> = new Subject();
  jwtHelper = new JwtHelperService();
  rowData: any;
  dateRanage: any;
  dashboardname: any;
  criteriatype: any;
  billtype: any;

  alert: boolean = false

  message: any;
  usercelldata: any
  userid: number;
  userMobile;
  userEmail;
  refreshedToken: any
  users: any;
  startDate: any;
  endDate: any;
  jsonRequest: JSON;
  obj: any;
  params: any;
  loading = false;
  showFiller = false;
  dashboard: any;
  dateTimeFormat: string;
  filter: string = ""
  time1 = { hour: 0, minute: 0 };
  time2 = { hour: 23, minute: 59 };
  paginationPageSize: any;

  recharge: boolean = false;
  billplanchange: boolean = false;
  dealerorder: boolean = false;
  tpdigitalservice: boolean = false;
  digitalplanconfiguration: boolean = false;
  entplanconfiguration: boolean = false;
  reconnection: boolean = false;

  criteriacomm: boolean = true;
  criteriabill: boolean = true;
  criteriadealer: boolean = true;
  criteriareconnection: boolean = true;
  subscription: Subscription;

  constructor(private http: HttpClient,
    private router: Router,
    private service: RestserviceService,
    private modalService: NgbModal
  ) {

    this.subscription = interval(840000).subscribe(val => this.generateToken());

    this.paginationPageSize = 23;
    this.defaultColDef = {
      flex: 1,
      enableValue: true,
      enableRowGroup: true,
      enablePivot: true,
      sortable: true,
      filter: true,
      resizable: true
    }

    // this.service.getalldashboardsbyuser().subscribe(data=>{
    //   console.log("%%%%%%%%%%%%%%%%%%%%%%%")
    //   console.log(data)
    //   this.dashboard = data
    //   this.hideandshow2();
    // })

  }

  //datepicker configuration

  public today: Date = new Date();
  public currentYear: number = this.today.getFullYear();
  public currentMonth: number = this.today.getMonth();
  public currentDay: number = this.today.getDate();


  public presets = [
    { label: 'Today', start: new Date(), end: new Date() },
    { label: 'This Month', start: new Date(new Date().setDate(1)), end: new Date() }
  ];
  public htmlAttributes = { name: "range", placeholder: "select date" };
  public maxDate: Object = new Date(this.currentYear, this.currentMonth, this.currentDay);
  //datepicker configuration end

  //autofit 
  sizeToFit() {
    this.gridApi.sizeColumnsToFit();
  }
  autoSizeAll(skipHeader) {
    var allColumnIds = [];
    this.gridColumnApi.getAllColumns().forEach(function (column) {
      allColumnIds.push(column.colId);
    });
    this.gridColumnApi.autoSizeColumns(allColumnIds, skipHeader);
  }
  //end of autoSizeColumns

  //main mathod execution


  // jsonRequestObj = JSON
  // objJson = {}
  // onGridReady(params) {
  //   this.jsonRequestObj = <JSON>this.objJson;
  //   this.loading = true;
  //   this.rangeDate();
  //   this.gridApi = params.api;
  //   this.gridColumnApi = params.columnApi;
  //   params.api.sizeColumnsToFit();
  //   let dataresp = this.service.dashboardErrorSummary(this.jsonRequest);
  //   dataresp.subscribe(data => {
  //     this.loading = false;
  //     console.log("data received");
  //     try {
  //       this.message = data
  //       this.message = this.message.resultStatus.errorMessage
  //       let abc = { "total": "", "activityname": "", "errorcode": "" }
  //       for (var key in abc) {
  //         this.columnDefs.push({
  //           headerName: key, field: key
  //         })
  //       }
  //       this.columnDefs.push({ headerName: 'Error Message',field: 'errormessage' }, {
  //         headerName: 'action', field: 'action', cellRendererFramework: CellCustomComponent, width: 90,
  //       })
  //       params.api.setColumnDefs(this.columnDefs);
  //       params.api.setRowData(this.users = []);
  //     } catch (e) {
  //       this.message = data
  //       let arr: any = []
  //       let obj = {}
  //       var abc = data[0];
  //       if (abc === undefined) {
  //         let abc = { "total": "", "activityname": "", "errorcode": "" }
  //         for (var key in abc) {
  //           this.columnDefs.push({
  //             headerName: key, field: key
  //           })
  //         }
  //         this.columnDefs.push({ headerName: 'Error Message',field: 'errormessage' }, {
  //           headerName: 'action', field: 'action', cellRendererFramework: CellCustomComponent, width: 90,
  //         })
  //         params.api.setColumnDefs(this.columnDefs);
  //         params.api.setRowData(this.users = []);
  //       } else {
  //         for (var key in abc) {
  //           this.columnDefs.push({
  //             headerName: key, field: key, filter: true,
  //             sortable: true, sortingOrder: ["asc", "desc"], suppressSizeToFit: true, resizable: true
  //           })
             
  //         }

  //         this.columnDefs.push({ headerName: 'Error Message', field: 'errormessage' }, {
  //           headerName: 'action', field: 'action', cellRendererFramework: CellCustomComponent
  //         })
  //         params.api.setColumnDefs(this.columnDefs);
  //         params.api.setRowData(this.users = data);
  //         console.log("user data ")
  //         console.log(this.users[0].activityname)
  //       }
  //     }

  //   })
  //   this.loading = false;
  // }
  //end of main method

  onGridReady(params) {
    this.loading = true;
    this.rangeDate();
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.service.dashboardErrorSummary(this.jsonRequest).subscribe(data=>{
      this.loading = false;
      this.message = data
      params.api.setColumnDefs(this.columnDefs);
      try{
        params.api.setRowData([]);
        this.alert = this.message.resultStatus.errorMessage
        //alert(this.message.resultStatus.errorMessage)
      }catch(e){
        params.api.setRowData(this.users = data);
      }

    },error=>{
      alert("request failed")
      this.loading = false;
      params.api.setRowData(this.users = []);
    })
  }

  //create request obj
  role: any;
  rangeDate() {
    this.filter = ""
    let currentDate = new Date();
    let earlierDate = new Date();
    earlierDate.setDate(currentDate.getDate() - 7);
    //this.defaultDateRange = earlierDate +"-"+ currentDate;
    if (this.dateRanage !== undefined) {
      let date: Date = new Date(this.dateRanage[0]);
      var month = date.getMonth() + 1
      this.startDate = date.getFullYear() + '-' + ("0" + month).slice(-2) + '-' + ("0" + date.getDate()).slice(-2) + " " + this.time1.hour + ":" + this.time1.minute + ":" + "00.000"
      //let dateStart = date.getFullYear() + '-' + month + '-' + date.getDate()

      let date1: Date = new Date(this.dateRanage[1]);
      var month = date1.getMonth() + 1
      this.endDate = date1.getFullYear() + '-' + ("0" + month).slice(-2) + '-' + ("0" + date1.getDate()).slice(-2) + " " + this.time2.hour + ":" + this.time2.minute + ":" + "00.000"
      //let dateEnd = date1.getFullYear() + '-' + month + '-' + date1.getDate()

      //for date placeholder      
      //this.dateRanage = dateStart + " to " + dateEnd
    } else {
      var month = currentDate.getMonth() + 1
      var earliermonth = earlierDate.getMonth() + 1
      this.startDate = "2021-07-20 00:00:00.000";
      //this.startDate = earlierDate.getFullYear() + '-' + ("0" + earliermonth).slice(-2) + '-' + ("0" + earlierDate.getDate()).slice(-2) + " 00:00:00.000"
      this.endDate = currentDate.getFullYear() + '-' + ("0" + month).slice(-2) + '-' + ("0" + currentDate.getDate()).slice(-2) + " 23:59:59.999"

      //for date placeholder
      //let dateStart = earlierDate.getFullYear() + '-' + earliermonth + '-' + earlierDate.getDate()
      //let dateEnd = currentDate.getFullYear() + '-' + month + '-' + currentDate.getDate()
      //this.dateRanage = dateStart + " to " + dateEnd
      //this.endDate = earlierDate.getFullYear() + '-' + earliermonth + '-' + earlierDate.getDate() + " 00:00:00.000"
    }


    if (this.criteriatype === undefined) {
      this.criteriatype = "channel"
    }

    if (this.dashboardname === undefined) {
      this.dashboard = sessionStorage.getItem("defaultdashboard")
      this.dashboardname = this.dashboard
    }else{
      sessionStorage.setItem("defaultdashboard",this.dashboardname)
    }

    this.obj = {
      "criteria": this.criteriatype, "dashboard": this.dashboardname,
      "fromtimestamp": this.startDate, "totimestamp": this.endDate
    }
    this.jsonRequest = <JSON>this.obj;
    if (this.billtype !== undefined && this.billtype !== null && this.dashboardname === "billplanchange") {
      this.jsonRequest["type"] = this.billtype;
    }
    console.log("json obj created")
    console.log(this.jsonRequest)

    logdates.logstartDate = this.startDate,
      logdates.logendDate = this.endDate
    logdates.logdashboardname = this.dashboardname

    for (var key in this.jsonRequest) {
      if (this.jsonRequest.hasOwnProperty(key)) {
        this.filter = this.filter + (key + " = " + this.jsonRequest[key] + ", ");
      }
    }



    this.columnDefs = [
      {  
        headerName: 'Error Summery',
        children: [
          {
            headerName: 'Total',
            field: 'total',        
          },
          {
            headerName: 'Activity Name',
            field: 'activityname',
          },
          {
            headerName: 'Error Code',
            field: 'errorcode',
          },
          {
            headerName: 'Error Message',
            field: 'errormessage',
          },
          {
            headerName: 'Action',
            cellRendererFramework: CellCustomComponent,
          }
        ]
      }
    ];    
  }
  //end of request obj

  generateToken(){
    let usernamep: string = JSON.parse((CryptoJS.AES.decrypt(localStorage.getItem('usernamep'), environment.encryptSecretKey)).toString(CryptoJS.enc.Utf8))
    this.service.pmcUser(usernamep).subscribe(data=>{
      this.message = data
      localStorage.setItem("token", this.message.token)     
    },error=>{
      this.loading = false;
      alert("request failed")
    })
  }

  updateRows() {
    console.log("update row clicked")
    this.loading = true;
    this.rangeDate()
    this.service.dashboardErrorSummary(this.jsonRequest).subscribe(data => {
      this.loading = false;
      console.log("updated data")
      this.message = data
      // let arr: any = []
      //   let obj = {}
      //   this.message.forEach(element => {
      //     let spliterrorcode = element.errorcode.split("~");
      //     obj = {
      //       "total": element.total, "activityname": element.activityname, "errorcode": spliterrorcode[0], "errorMessage": spliterrorcode[1]
      //     }
      //     arr.push(obj)
      //   });
      this.gridApi.setRowData([])
      var newData = data;
      this.gridApi.applyTransaction({ add: newData });
    },e=>{
      this.loading = false;
      alert("request failed")
      this.gridApi.setRowData([])
    })
  }


  ngOnInit() {

    this.hideandshow2()
    $("#errordash").css("background-color", "#9ee6f7");
    //this.hideanShowGame()
    $("#dashboard").change(function () {
      var name = $("#dashboard").val();
      console.log(name)
      $(".type").hide();
      $("." + name).show();
      if (name == "dealerorder") {
        $("." + "dealerorderhide").hide();
      } else {
        $("." + "dealerorderhide").show();
      }
    })

    // this.browserRefresh = browserRefresh;
    // //    if(this.browserRefresh){
    // //    this.generateRefreshedToken();
    // // }
    // console.log('refreshed?:', browserRefresh);
    // this.setTimeout();
    // this.userInactive.subscribe(data => {
    //   console.log("Session Expired admin")
    //   this.logout();
    // }
    //);
  }

  logout() {
    localStorage.removeItem("token")
    localStorage.removeItem("rolep")
    localStorage.removeItem("usernamep")
    sessionStorage.removeItem("dashboardAccess")
    sessionStorage.removeItem("dashboards")
    this.router.navigate(['']);
  }

  //jquery to hide dropdown childrens
  // hideanShowGame() {
  //   $("#dashboard").children('option').hide();
  //   let storedRole = localStorage.getItem("role")
  //   if (storedRole === "admin") {
  //     this.dashboard = config.admin;
  //   } else if (storedRole === "user") {
  //     this.dashboard = config.user;
  //   }

  //   console.log(this.dashboard[0])
  //   for (let i = 0; i < this.dashboard.length; i++) {
  //     let showitem = this.dashboard[i]
  //     $("#dashboard option[value=" + showitem + "]").show();
  //   }
  // }
  //end of hide option

  //export to csv
  exporttocsv() {
    var params = {
    };
    this.gridApi.exportDataAsCsv(params);
  }
  //end 

  //idle timeouts
  setTimeout() {
    this.userActivity = setTimeout(() => this.userInactive.next(undefined), environment.idleSessionExpired);
  }
  ngOnDestroy() {
    clearInterval(this.userActivity);
    this.subscription.unsubscribe();
  }

  @HostListener('window:mousemove') refreshUserState() {
    clearTimeout(this.userActivity);
    this.setTimeout();
  }
  @HostListener('window:scroll') refreshUserStatescroll() {
    clearTimeout(this.userActivity);
    this.setTimeout();
  }
  @HostListener('document:keypress') refreshUserStatekeypress() {
    clearTimeout(this.userActivity);
    this.setTimeout();
  }
  //end class

  errorDashboard() {
    this.router.navigate(["/error"])
      .then(() => {
        window.location.reload();
      });
  }

  homeDashboard() {
    this.router.navigate(["/home"])
      .then(() => {
        window.location.reload();
      });
  }

  trackingDashboard() {
    this.router.navigate(["/tracking"])
      .then(() => {
        window.location.reload();
      });
  }

  openVerticallyCentered(content) {
    this.dashboardname = undefined;
    this.criteriacomm = false;
    this.criteriabill = false;
    this.criteriadealer = false;
    this.criteriareconnection = false
    this.modalService.open(content, { centered: true });
  }

  nameChanged(arg) {
    // $(".type").hide();
    // $("." + arg).show();
    // if (arg == "dealerorder") {
    //   $("." + "dealerorderhide").hide();
    // } else {
    //   $("." + "dealerorderhide").show();
    // }
    $("." + "recharge").hide();
    $("." + "billplanchange").hide();
    $("." + "dealerorder").hide();
    $("." + "tpdigitalservice").hide();
    $("." + "digitalplanconfiguration").hide();
    $("." + "entplanconfiguration").hide();
    $("." + "reconnection").hide();
    console.log(arg)
    $(".type").hide();
    $("." + arg).show();

    if (arg === "recharge" || arg === "tpdigitalservice" || arg === "digitalplanconfiguration" || arg === "entplanconfiguration") {
      this.criteriacomm = true;
    }
    if (arg === "billplanchange") {
      this.criteriabill = true;
    }
    if (arg === "dealerorder") {
      this.criteriadealer = true;
    }
    if (arg === "reconnection") {
      this.criteriareconnection = true;
    }
  }

  storedRole: any
  hideandshow2() {
    this.dashboard = JSON.parse((CryptoJS.AES.decrypt(sessionStorage.getItem("dashboards"), environment.encryptSecretKey)).toString(CryptoJS.enc.Utf8))

    if (this.dashboard.includes("recharge")) {
      this.recharge = true;
    }
    if (this.dashboard.includes("billplanchange")) {
      this.billplanchange = true
    }
    if (this.dashboard.includes("dealerorder")) {
      this.dealerorder = true;
    }
    if (this.dashboard.includes("tpdigitalservice")) {
      this.tpdigitalservice = true
    }
    if (this.dashboard.includes("digitalplanconfiguration")) {
      this.digitalplanconfiguration = true;
    }
    if (this.dashboard.includes("entplanconfiguration")) {
      this.entplanconfiguration = true
    }
    if (this.dashboard.includes("reconnection")) {
      this.reconnection = true
    }
  }

  valueEmittedFromChildComponent: any;
  parrentEventHandlerFunction(valueEmitted) {
    this.valueEmittedFromChildComponent = valueEmitted;
  }
  valueEmittedFromChildComponentMilestone: any;
  parrentEventHandlerFunctionMilestone(valueEmitted) {
    this.valueEmittedFromChildComponentMilestone = valueEmitted;
  }

}
