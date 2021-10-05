import { Component, HostListener, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { RestserviceService } from '../restservice.service';
import { config, environment } from 'src/environments/environment';
import { Subject } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { NgbModal, ModalDismissReasons, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import * as CryptoJS from 'crypto-js';
import { ProcessDetailsTrackingComponent } from '../process-details-tracking/process-details-tracking.component';
import { interval, Subscription } from 'rxjs';

export var trackingvariables = {
  trackingdashboard: "",
  trackingreferenceno: "",
  trackingtransrefno: "",
  trackingtransDate: "",
};

declare var $: any;
//export let browserRefresh = false;

@Component({
  selector: 'app-tracking',
  templateUrl: './tracking.component.html',
  styleUrls: ['./tracking.component.css']
})
export class TrackingComponent implements OnInit {

  private gridApi;
  private gridColumnApi;
  public columnDefs = [];
  private columnDefsLineItems = [];
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
  state: any;
  rechargerefno: any;
  serviceid: any;
  customerid: any;
  transrefno: any;
  noofrows: any;
  businteraction: any;
  public whichdashboard: any;
  referenceno: any;
  orderrefno: any;
  productid: any;
  isDoubleClick: boolean = false;

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
  filter: string = ""
  time1 = { hour: 0, minute: 0 };
  time2 = { hour: 23, minute: 59 };
  paginationPageSize: any;
  progressmsg: any = "hlelo";

  recharge: boolean = false;
  billplanchange: boolean = false;
  dealerorder: boolean = false;
  tpdigitalservice: boolean = false;
  digitalplanconfiguration: boolean = false;
  entplanconfiguration: boolean = false;
  reconnection: boolean = false;

  statecomm: boolean = false;
  typebill: boolean = false;
  rechargeref: boolean = false;
  serviceidwdealer: boolean = false;
  customeridwbill: boolean = false;
  transrefnowbillnorder: boolean = false;
  orderrefnodealer: boolean = false;
  productiddealer: boolean = false;
  noofrowscomm: boolean = false;
  refnowrecharge: boolean = false;

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
      minWidth: 100,
      enableValue: true,
      enableRowGroup: true,
      enablePivot: true,
      sortable: true,
      filter: true,
      resizable: true
    }

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
  // onGridReady(params) {
  //   this.loading = true;
  //   this.rangeDate();
  //   this.gridApi = params.api;
  //   this.gridColumnApi = params.columnApi;
  //   params.api.sizeColumnsToFit();
  //   let dataresp = this.service.tracking(this.jsonRequest);
  //   dataresp.subscribe(data => {
  //     this.loading = false;
  //     console.log("data received");
  //     this.message = data
  //     console.log(data);
  //     //this.rowData = data;
  //     var abc = data[0];
  //     console.log("abc is");
  //     console.log(abc)
  //     if (abc === undefined) {
  //       let abc = { "processtimestamp": "", "paymentmode": "-", "referenceno": "", "processstate": "", "customerid": "", "channel": "", "processtype": "", "circle": "", "transactiontimestamp": "", "transrefno": "" }
  //       for (var key in abc) {
  //         this.columnDefs.push({
  //           headerName: key, field: key
  //         })
  //       }
  //       params.api.setColumnDefs(this.columnDefs);
  //       params.api.setRowData(this.users = []);
  //     } else {
  //       for (var key in abc) {
  //         this.columnDefs.push({
  //           headerName: key, field: key, filter: true,
  //           sortable: true, sortingOrder: ["asc", "desc"], suppressSizeToFit: true, resizable: true
  //         })
  //         params.api.setColumnDefs(this.columnDefs);

  //       }
  //       params.api.setRowData(this.users = data);
  //       console.log(this.users)
  //     }

  //   })
  // }
  // //end of main method
  generateToken() {
    let usernamep: string = JSON.parse((CryptoJS.AES.decrypt(localStorage.getItem('usernamep'), environment.encryptSecretKey)).toString(CryptoJS.enc.Utf8))
    this.service.pmcUser(usernamep).subscribe(data => {
      this.message = data
      localStorage.setItem("token", this.message.token)
    },error=>{
      this.loading = false;
      alert("request failed")
    })
  }

  onGridReady(params) {
    this.loading = true;
    this.rangeDate();
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.service.tracking(this.jsonRequest).subscribe(data => {
      this.loading = false;
      this.message = data;
      params.api.setColumnDefs(this.columnDefs);
      try {
        params.api.setRowData([]);
        this.alert = this.message.resultStatus.errorMessage
        //alert(this.message.resultStatus.errorMessage)
      } catch (e) {
        params.api.setRowData(this.users = data);
      }
    },error=>{
      this.loading = false;
      params.api.setRowData([]);
      alert("request failed")
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
      let date1: Date = new Date(this.dateRanage[1]);
      var month = date1.getMonth() + 1
      this.endDate = date1.getFullYear() + '-' + ("0" + month).slice(-2) + '-' + ("0" + date1.getDate()).slice(-2) + " " + this.time2.hour + ":" + this.time2.minute + ":" + "00.000"

    } else {
      var month = currentDate.getMonth() + 1
      var earliermonth = earlierDate.getMonth() + 1
      //7 day before date
      //this.startDate = earlierDate.getFullYear() + '-' + ("0" + earliermonth).slice(-2) + '-' + ("0" + earlierDate.getDate()).slice(-2) + " 00:00:00.000"
      this.startDate = currentDate.getFullYear() + '-' + ("0" + month).slice(-2) + '-' + ("0" + currentDate.getDate()).slice(-2) + " " + ("0" + (currentDate.getHours()-2)).slice(-2) + ":" + ("0" + currentDate.getMinutes()).slice(-2) + ":" + ("0" + currentDate.getSeconds()).slice(-2) + ".000"
      //earlier end date
      //this.endDate = currentDate.getFullYear() + '-' + ("0" + month).slice(-2) + '-' + ("0" + currentDate.getDate()).slice(-2) + " 23:59:59.999"
      this.endDate = currentDate.getFullYear() + '-' + ("0" + month).slice(-2) + '-' + ("0" + currentDate.getDate()).slice(-2) + " " + ("0" + currentDate.getHours()).slice(-2) + ":" + ("0" + currentDate.getMinutes()).slice(-2) + ":" + ("0" + currentDate.getSeconds()).slice(-2) + ".000"
    }

    if (this.whichdashboard !== undefined && this.whichdashboard !== this.dashboardname) {
      this.jsonRequest["dashboard"] = this.whichdashboard;
      sessionStorage.setItem("defaultdashboard", this.whichdashboard)
    } else {
      //this.jsonRequest["dashboard"] = sessionStorage.getItem("defaultdashboard")
      this.whichdashboard = sessionStorage.getItem("defaultdashboard")
    }

    this.obj = {
      "dashboard": this.whichdashboard,
      "fromtimestamp": this.startDate, "totimestamp": this.endDate
    }
    this.jsonRequest = <JSON>this.obj;
    if (this.billtype !== undefined && this.billtype !== null && this.dashboardname === "billplanchange") {
      this.jsonRequest["type"] = this.billtype;
    }
    if (this.state !== undefined && this.state !== "All") {
      this.jsonRequest["processstate"] = this.state;
    }
    if (this.businteraction !== undefined && this.businteraction !== "All") {
      this.jsonRequest["type"] = this.businteraction;
    }
    if (this.rechargerefno !== undefined && this.rechargerefno !== "") {
      this.jsonRequest["referenceno"] = this.rechargerefno;
    }
    if (this.serviceid !== undefined && this.serviceid !== "") {
      this.jsonRequest["serviceid"] = this.serviceid;
    }
    console.log(this.customerid)
    if (this.customerid !== undefined && this.customerid !== "") {
      this.jsonRequest["customerid"] = this.customerid;
    }
    if (this.transrefno !== undefined && this.transrefno !== "") {
      this.jsonRequest["transrefno"] = this.transrefno;
    }
    if (this.noofrows !== undefined && this.noofrows !== "") {
      this.jsonRequest["numberofrows"] = this.noofrows;
    }
    if (this.referenceno !== undefined && this.referenceno !== "") {
      this.jsonRequest["referenceno"] = this.referenceno;
    }
    if (this.orderrefno !== undefined && this.orderrefno !== "") {
      this.jsonRequest["referenceno"] = this.orderrefno;
    }
    if (this.productid !== undefined && this.productid !== "") {
      this.jsonRequest["productid"] = this.productid;
    }

    console.log("json obj created")
    console.log(this.jsonRequest)
    for (var key in this.jsonRequest) {
      if (this.jsonRequest.hasOwnProperty(key)) {
        this.filter = this.filter + (key + " = " + this.jsonRequest[key] + ", ");
      }
    }

    this.columnDefs = [
      {

        headerName: 'Tracking',
        children: [
          {
            headerName: 'Processtimestamp',
            field: 'processtimestamp',
          },
          {
            headerName: 'Paymentmode',
            field: 'paymentmode',
          },
          {
            headerName: 'Referenceno',
            field: 'referenceno',
          },
          {
            headerName: 'Processstate',
            field: 'processstate',
          },
          {
            headerName: 'Customerid',
            field: 'customerid',
          },
          {
            headerName: 'Channel',
            field: 'channel',
          },
          {
            headerName: 'Processtype',
            field: 'processtype',
          },
          {
            headerName: 'Circle',
            field: 'circle',
          },
          {
            headerName: 'Transactiontimestamp',
            field: 'transactiontimestamp',
          },
          {
            headerName: 'Transrefno',
            field: 'transrefno',
          },
          {
            headerName: 'Action',
            cellRendererFramework: ProcessDetailsTrackingComponent,
          }
        ]
      }
    ];
  }
  //end of request obj

  clearVar() {
    this.dashboardname = undefined;
    this.criteriatype = undefined;
    this.billtype = undefined;
    this.state = undefined;
    this.rechargerefno = undefined;
    this.serviceid = undefined;
    this.customerid = undefined;
    this.transrefno = undefined;
    this.noofrows = undefined;
    this.businteraction = undefined;
    this.whichdashboard = undefined;
    this.referenceno = undefined;
    this.orderrefno = undefined;
    this.productid = undefined;
    console.log("cleared variables")
  }

  updateRows() {
    console.log("update row clicked")
    this.loading = true;
    this.rangeDate()
    this.service.tracking(this.jsonRequest).subscribe(data => {
      this.loading = false;
      console.log("updated data")
      this.message = data
      console.log(data[0])
      this.gridApi.setRowData([])
      var newData = data;
      if (newData[0] !== undefined) {
        this.gridApi.applyTransaction({ add: newData });
      }
      this.clearVar();

    },error=>{
      alert("request failed")
      this.loading = false;
      this.gridApi.setRowData([])
    })
  }

  ngOnInit(): void {
    $("#trackdash").css("background-color", "#9ee6f7");
    this.hideandshow2()


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

  test() {
    //console.log(this.dealerordertype)
  }

  openVerticallyCentered(content) {
    this.whichdashboard = undefined;
    this.statecomm = false;
    this.typebill = false;
    this.rechargeref = false;
    this.serviceidwdealer = false;
    this.customeridwbill = false;
    this.transrefnowbillnorder = false;
    this.orderrefnodealer = false;
    this.productiddealer = false;
    this.noofrowscomm = false;
    this.refnowrecharge = false;

    this.modalService.open(content, { centered: true });
  }


  nameChanged1(arg) {
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

    if (arg !== undefined) {
      this.statecomm = true;
      this.noofrowscomm = true;
    }
    if (arg === "billplanchange") {
      this.typebill = true;
    }
    if (arg === "recharge") {
      this.rechargeref = true;
    }
    if (arg !== "dealerorder" && arg !== "reconnection") {
      this.serviceidwdealer = true;
    }
    if (arg !== "billplanchange" && arg !== "dealerorder") {
      this.customeridwbill = true;
    }
    if (arg !== "billplanchange" && arg !== "dealerorder") {
      this.transrefnowbillnorder = true;
    }
    if (arg === "dealerorder") {
      this.orderrefnodealer = true;
    }
    if (arg === "dealerorder") {
      this.productiddealer = true;
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

  onRowClicked(args) {
    console.log(args.data)
    //trackingvariables.trackingdashboard = sessionStorage.getItem()
    trackingvariables.trackingreferenceno = args.data.referenceno
    trackingvariables.trackingtransrefno = args.data.transrefno
    trackingvariables.trackingtransDate = args.data.transactiontimestamp
  }

  lineItems(lineitems) {
    this.modalService.open(lineitems, { size: 'xl' });
  }

  jsonRequestLineItems: JSON
  objLineItems = {}
  domLayout: any
  onGridReadyLineItems(params) {
    this.domLayout = "autoHeight";
    let request = ""
    this.objLineItems = {
      "dashboard": sessionStorage.getItem("defaultdashboard"),
      "referenceno": trackingvariables.trackingreferenceno,
      "transrefno": trackingvariables.trackingtransrefno,
      "transactiontimestamp": trackingvariables.trackingtransDate
    }
    this.service.lineItems(this.objLineItems).subscribe(data => {
      console.log("hello")
      var abc = data[0];
      this.columnDefsLineItems = []
      if (abc !== undefined) {        
        for (var key in abc) {
          this.columnDefsLineItems.push({
            headerName: key, field: key
          })
        }
        params.api.setColumnDefs(this.columnDefsLineItems);
      }else{
        params.api.setColumnDefs([]);
      }
      try {
        params.api.setRowData([]);
        this.alert = this.message.resultStatus.errorMessage
        //alert(this.message.resultStatus.errorMessage)
      } catch (e) {
        params.api.setRowData(this.users = data);
      }
    }, error => {
      this.loading = false;
      alert("request failed")
      params.api.setRowData(this.users = []);
      console.log(error)
    })
  }

}
