import { Component, HostListener, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { RestserviceService } from '../restservice.service';
import { config, environment } from 'src/environments/environment';
import { Subject } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { interval, Subscription } from 'rxjs';
import { NgbModal, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { NgbDate, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import * as CryptoJS from 'crypto-js';


declare var $: any;
//export let browserRefresh = false;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})



export class HomeComponent implements OnInit {
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
  criteriatype: any = "channel";
  billtype: any;
  dealerordertype: any;
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
  stringJson: string;
  obj: any;
  params: any;
  loading = false;
  showFiller = false;
  // dashboard: any;

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
  time1 = { hour: 0, minute: 0 };
  time2 = { hour: 23, minute: 59 };
  hoveredDate: NgbDate | null = null;
  filter: any;
  paginationPageSize: any;

  dashboard: any;

  constructor(private http: HttpClient,
    private router: Router,
    private service: RestserviceService,
    private modalService: NgbModal, public formatter: NgbDateParserFormatter,
    private calendar: NgbCalendar,
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
      resizable: true,
      suppressSizeToFit: true,
      sortingOrder: ["asc", "desc"],
    }



    // this.subscription = interval(60000).subscribe(val => this.autoUpdateRows());

  }

  // datepicker configuration
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

  generateToken() {
    let usernamep: string = JSON.parse((CryptoJS.AES.decrypt(localStorage.getItem('usernamep'), environment.encryptSecretKey)).toString(CryptoJS.enc.Utf8))
    this.service.pmcUser(usernamep).subscribe(data => {
      this.message = data
      localStorage.setItem("token", this.message.token)
    },error=>{
      alert("request failed")
    })
  }
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
  //   console.log("on grid ready")
  //   this.loading = true;
  //   this.requestBuilder()
  //   this.gridApi = params.api;
  //   this.gridColumnApi = params.columnApi;
  //   params.api.sizeColumnsToFit();
  //   let dataresp = this.service.dashboardSummary(this.jsonRequest);
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
  //       let abc = { criteria: "UNKNOWN", inprogress: 0, cancelled: 0, received: 3, failed: 1, completed: 2 }
  //       for (var key in abc) {
  //         this.columnDefs.push({
  //           headerName: key, field: key
  //         })
  //         params.api.setColumnDefs(this.columnDefs);
  //       }
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
  //end of main method

  onGridReady(params) {
    this.loading = true;
    this.requestBuilder()

    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.service.dashboardSummary(this.jsonRequest).subscribe(data => {
      this.loading = false;
      this.message = data
      params.api.setColumnDefs(this.columnDefs);
      try {
        params.api.setRowData([]);
        this.alert = this.message.resultStatus.errorMessage
        this.gridApi.setPinnedBottomRowData([]);
        //alert(this.message.resultStatus.errorMessage)
      } catch (e) {
        params.api.setRowData(this.users = data);
        setTimeout(() => {
          let pinnedBottomData = this.generatePinnedBottomData();
          this.gridApi.setPinnedBottomRowData([pinnedBottomData]);
        }, 500)
      }
    }, error => {
      this.loading = false;
      alert("Request failed")
      params.api.setRowData(this.users = []);
    })
  }

  bitag = false;
  typetag = false;
  journeytaginput;
  rangetaginput;
  criteriataginput;
  bitaginput;
  typetaginput;
  role: any;
  requestBuilder() {
    this.filter = ""
    let currentDate = new Date();
    let earlierDate = new Date();
    earlierDate.setDate(currentDate.getDate() - 7);
    if (this.dateRanage !== undefined) {
      // this.startDate = this.startDate+ " "+ this.time1.hour+":"+this.time1.minute+":"+"00.000"
      // this.endDate = this.endDate+ " "+ this.time2.hour+":"+this.time2.minute+":"+"00.000"
      let date: Date = new Date(this.dateRanage[0]);
      var month = date.getMonth() + 1
      this.startDate = date.getFullYear() + '-' + ("0" + month).slice(-2) + '-' + ("0" + date.getDate()).slice(-2) + " " + this.time1.hour + ":" + this.time1.minute + ":" + "00.000"
      let dateStart = date.getFullYear() + '-' + month + '-' + date.getDate()

      let date1: Date = new Date(this.dateRanage[1]);
      var month = date1.getMonth() + 1
      this.endDate = date1.getFullYear() + '-' + ("0" + month).slice(-2) + '-' + ("0" + date1.getDate()).slice(-2) + " " + this.time2.hour + ":" + this.time2.minute + ":" + "00.000"
      let dateEnd = date1.getFullYear() + '-' + month + '-' + date1.getDate()

      //for date placeholder
      //this.dateRanage = dateStart + " to " + dateEnd
    } else {
      var month = currentDate.getMonth() + 1
      var earliermonth = earlierDate.getMonth() + 1
      this.startDate = earlierDate.getFullYear() + '-' + ("0" + earliermonth).slice(-2) + '-' + ("0" + earlierDate.getDate()).slice(-2) + " 00:00:00.000"
      this.endDate = currentDate.getFullYear() + '-' + ("0" + month).slice(-2) + '-' + ("0" + currentDate.getDate()).slice(-2) + " 23:59:59.999"
      //this.startDate = "2021-07-26 00:00:00.000"
      //this.endDate = "2021-08-01 23:59:59.999"

    }
    if (this.criteriatype === undefined) {
      this.criteriatype = "channel"
    }


    if (this.dashboardname === undefined) {
      //this.dashboard = JSON.parse((CryptoJS.AES.decrypt(sessionStorage.getItem("dashboards"), environment.encryptSecretKey)).toString(CryptoJS.enc.Utf8))
      this.dashboard = sessionStorage.getItem("defaultdashboard")
      this.dashboardname = this.dashboard
    } else {
      sessionStorage.setItem("defaultdashboard", this.dashboardname)
    }

    this.obj = {
      "criteria": this.criteriatype, "dashboard": this.dashboardname,
      "fromtimestamp": this.startDate,
      "totimestamp": this.endDate
    }
    this.jsonRequest = <JSON>this.obj;

    if (this.billtype !== undefined && this.billtype !== null && this.dashboardname === "billplanchange") {
      this.jsonRequest["type"] = this.billtype;
      this.bitaginput = this.billtype
      this.bitag = true
    }else{
      this.bitag = false;
    }

    if (this.dealerordertype !== undefined && this.dealerordertype !== null && this.dashboardname === "dealerorder") {
      this.jsonRequest["criteria"] = this.dealerordertype;
    }

    console.log("json obj created")
    console.log(this.jsonRequest)

    for (var key in this.jsonRequest) {
      if (this.jsonRequest.hasOwnProperty(key)) {
        this.filter = this.filter + (key + " = " + this.jsonRequest[key] + ", ");
      }
    }

    this.journeytaginput = this.dashboardname.charAt(0).toUpperCase() + this.dashboardname.slice(1)
    this.criteriataginput = this.jsonRequest["criteria"].charAt(0).toUpperCase() + this.jsonRequest["criteria"].slice(1)
    this.rangetaginput = this.startDate.slice(0, -7)  + " to " + this.endDate.slice(0, -7)
    

    this.startDate = undefined;
    this.endDate = undefined;

    this.columnDefs = [
      {

        headerName: 'Dashboard Summery',
        children: [
          {
            headerName: this.criteriatype,
            field: 'criteria',
            pinnedRowCellRenderer: function (params) { return '<strong>' + params.data.criteria + '</strong>' },
          },
          {
            headerName: 'Inprogress',
            field: 'inprogress',
          },
          {
            headerName: 'Cancelled',
            field: 'cancelled',
          },
          {
            headerName: 'Received',
            field: 'received',
          },
          {
            headerName: 'Failed',
            field: 'failed',
          },
          {
            headerName: 'Completed',
            field: 'completed',
            pinnedRowCellRenderer: function (params) { return '<strong>' + params.data.completed + '</strong>' },
          }
        ]
      }
    ];

  }


  generatePinnedBottomData() {
    // generate a row-data with null values
    let result = {};

    this.gridColumnApi.getAllGridColumns().forEach(item => {
      result[item.colId] = null;
    });
    return this.calculatePinnedBottomData(result);
  }

  calculatePinnedBottomData(target: any) {
    //console.log(target);
    //list of columns fo aggregation
    let columnsWithAggregation = ['inprogress', 'cancelled', 'received', 'failed', 'completed']
    columnsWithAggregation.forEach(element => {
      console.log('element', element);
      target[element] = 0
      this.gridApi.forEachNodeAfterFilter((rowNode: any) => {
        //if(rowNode.index < 10){
        //console.log(rowNode);
        //}
        if (rowNode.data[element])
          target[element] += Number(rowNode.data[element].toFixed(2));
      });
      if (target[element])
        target[element] = `${target[element].toFixed(2)}`;
    })
    //console.log(target);
    target['criteria'] = 'Total';
    return target;
  }

  updateRows() {
    console.log("update row clicked")
    this.loading = true;
    this.requestBuilder()
    this.service.dashboardSummary(this.jsonRequest).subscribe(data => {
      this.loading = false;
      console.log("updated data")
      this.message = data[0]
      if (this.message !== undefined) {
        this.gridApi.setRowData([])
        var newData = data;
        this.gridApi.applyTransaction({ add: newData });
        setTimeout(() => {
          let pinnedBottomData = this.generatePinnedBottomData();
          this.gridApi.setPinnedBottomRowData([pinnedBottomData]);
        }, 500)
      } else {
        this.gridApi.setRowData([])
        this.gridApi.setPinnedBottomRowData([]);
      }

    },error=>{
      this.loading = false;
      alert("Request failed")
      this.gridApi.setRowData([])
    })
  }

  autoUpdateRows() {
    console.log("auto update start")
    //this.rangeDate()
    this.service.dashboardSummary(this.jsonRequest).subscribe(data => {
      console.log("auto update successfull")
      this.message = data
      this.gridApi.setRowData([])
      var newData = data;
      this.gridApi.applyTransaction({ add: newData });
    },error=>{
      this.loading = false;
      alert("request failed")
      this.gridApi.setRowData([])
    })
  }

  ngOnInit(): void {
    this.hideandshow2();
    $("#trackdash").css("background-color", "#9ee6f7");
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

  openVerticallyCentered(content) {
    this.dashboardname = undefined;
    this.criteriacomm = false;
    this.criteriabill = false;
    this.criteriadealer = false;
    this.criteriareconnection = false;
    this.modalService.open(content, { centered: true });
  }

  storedRole: any
  hideandshow2() {
    console.log("hide and show")
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
