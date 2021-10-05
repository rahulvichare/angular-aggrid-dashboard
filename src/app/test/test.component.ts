import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { HomeComponent } from '../home/home.component';
import { config, environment } from 'src/environments/environment';
import { logdates } from '../failure-stats/failure-stats.component';
import { RestserviceService } from '../restservice.service';
import { CellCustomMilestoneComponent } from '../cell-custom-milestone/cell-custom-milestone.component';
import { AppRoutingModule } from '../app-routing.module';
import { cellCustomComponent } from '../cell-custom/cell-custom.component';
import * as CryptoJS from 'crypto-js';
import { ThrowStmt } from '@angular/compiler';
declare var $: any;
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {
  // @Output()
  // buttonClicked: EventEmitter<string> = new EventEmitter<string>();
  recharge: boolean = false;
  billplanchange: boolean = false;
  dealerorder: boolean = false;
  tpdigitalservice: boolean = false;
  digitalplanconfiguration: boolean = false;
  entplanconfiguration: boolean = false;
  reconnection: boolean = false;

  public whichdashboard: any;
  public activityname: any;
  public errorcode: any;
  public fromtimestamp: any;
  public totimestamp: any;
  public numberofrows: any;
  public businteraction: any;

  numberofrowslogs: boolean = false
  errorcodelogs: boolean = false
  activitynamelogs: boolean = false
  bilogs: boolean = false

  dashboard: any
  params: any;
  jsonRequest: JSON;
  obj: any;
  public defaultColDef;
  public gridApi;
  columnDefs = [];
  message: any;
  users: any;
  public dateRanage: any;
  startDate: any;
  endDate: any;
  loading: boolean = false;

  time1 = { hour: 0, minute: 0 };
  time2 = { hour: 23, minute: 59 };
  paginationPageSize: any;
  obj1: any;
  jsonRepushRequest: any;
  selectedObj = [];
  finalObj: any;
  username: string = JSON.parse((CryptoJS.AES.decrypt(localStorage.getItem('usernamep'), environment.encryptSecretKey)).toString(CryptoJS.enc.Utf8))

  filter: any = HomeComponent;

  columnobj: any;
  columnJson: JSON;
  errorTracking = [];

  constructor(private router: Router, private service: RestserviceService,private modalService: NgbModal) {
    this.paginationPageSize = 16;
    this.defaultColDef = {
      flex: 1,
      minWidth: 100,
      enableValue: true,
      enableRowGroup: true,
      enablePivot: true,
      sortable: true,
      filter: true,
    }

  }
  ngOnInit(): void {
    //this.hideandshow2()
  }
  clickButton(e) {
    e.show()
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

  namechangearg: any;
  nameChanged1(arg) {
    $("." + "recharge").hide();
    $("." + "billplanchange").hide();
    $("." + "dealerorder").hide();
    $("." + "tpdigitalservice").hide();
    $("." + "digitalplanconfiguration").hide();
    $("." + "entplanconfiguration").hide();
    $("." + "reconnection").hide();
    $(".type").hide();
    $("." + arg).show();
    this.namechangearg = arg
    this.repushhideandshow();
    this.showlogsmenu();
  }

  showlogsmenu() {
    this.numberofrowslogs = true
    this.errorcodelogs = true
    this.activitynamelogs = true
    if (this.namechangearg == "billplanchange") {
      this.bilogs = true
    } else {
      this.bilogs = false
    }
  }

  dashboardJson: JSON
  dashboardObj = {}
  repushshow: boolean = false
  repushhideandshow() {
    this.dashboardJson = <JSON>this.dashboardObj
    this.service.getpmcdashboard().subscribe(data => {
      var splitdashboards = data.split(",");
      splitdashboards.forEach(dashboard => {
        var splitagain = dashboard.split("-")
        this.dashboardJson[splitagain[0]] = splitagain[1]
      })
      console.log(this.dashboardJson)
      console.log(this.dashboardJson[this.namechangearg])
      if (this.dashboardJson[this.namechangearg] === "all" && this.namechangearg !=="billplanchange") {
        this.repushshow = true;
      } else {
        this.repushshow = false;
      }
    },error=>{
      alert("request failed")
    })
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

  onRowClicked(args) {
    cellCustomComponent.transrefno = args.data.transrefno
    logdates.logdashboardname = this.whichdashboard
    cellCustomComponent.referenceno = args.data.referenceno
    cellCustomComponent.transDate = args.data.transactiontimestamp
  }

  selectedDashboard:any;
  requestBuilder1() {
    this.loading = true;
    this.filter = ""
    let currentDate = new Date();
    let earlierDate = new Date();
    if (this.dateRanage !== undefined && this.dateRanage !== null) {
      // this.startDate = this.startDate+ " "+ this.time1.hour+":"+this.time1.minute+":"+"00.000"
      // this.endDate = this.endDate+ " "+ this.time2.hour+":"+this.time2.minute+":"+"00.000"
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
      this.startDate = earlierDate.getFullYear() + '-' + ("0" + earliermonth).slice(-2) + '-' + ("0" + earlierDate.getDate()).slice(-2) + " 00:00:00.000"
      this.endDate = currentDate.getFullYear() + '-' + ("0" + month).slice(-2) + '-' + ("0" + currentDate.getDate()).slice(-2) + " 23:59:00.000"
      //this.startDate = "2021-07-26 00:00:00.000"
      //this.endDate = "2021-08-01 23:59:59.999"

    }
    this.obj = {
      "fromtimestamp": this.startDate,
      "totimestamp": this.endDate
    }
    this.jsonRequest = <JSON>this.obj;


    if (this.whichdashboard !== undefined && this.whichdashboard !== null && this.whichdashboard !== "") {
      this.jsonRequest["dashboard"] = this.whichdashboard;
    } else {
      this.loading = false;
      //alert("Please select dashboard");
      return;
    }
    if (this.activityname !== undefined && this.activityname !== null && this.activityname !== "") {
      this.jsonRequest["activityname"] = this.activityname.replace(/\s/g, "");
    } 
    // else {
    //   this.loading = false;
    //   alert("Please enter activityname");
    //   return;
    // }
    if (this.errorcode !== undefined && this.errorcode !== null && this.errorcode !== "") {
      this.jsonRequest["errorcode"] = this.errorcode.replace(/\s/g, "");
    } 
    // else {
    //   this.loading = false;
    //   alert("Please enter a valid error code");
    //   return;
    // }
    if (this.numberofrows !== undefined && this.numberofrows !== null && this.numberofrows !== "") {
      this.jsonRequest["numberofrows"] = this.numberofrows.replace(/\s/g, "");
    }
    if (this.businteraction !== undefined && this.businteraction !== null && this.businteraction !== "" && this.whichdashboard === "billplanchange") {
      this.jsonRequest["type"] = this.businteraction;
    }
    
    let isbillplan = true;
    if(this.whichdashboard === "billplanchange"){
      isbillplan = false
    }

    this.columnDefs = [
      {
        headerName: 'Error Tracking',
        children: [
          {
            headerName: "Activity name",
            field: 'activityname',
            minWidth: 180,
            headerCheckboxSelection: true,
            headerCheckboxSelectionFilteredOnly: true,
            checkboxSelection: true,
            filter: true,
            sortable: true,
            sortingOrder: ["asc", "desc"],
            suppressSizeToFit: true,
            resizable: true
          },
          {
            headerName: "Process type",
            field: 'processtype',
            filter: true,
            sortable: true,
            sortingOrder: ["asc", "desc"],
            suppressSizeToFit: true,
            resizable: true
          },
          {
            headerName: "Referenceno",
            field: 'referenceno',
            filter: true,
            sortable: true,
            sortingOrder: ["asc", "desc"],
            suppressSizeToFit: true,
            resizable: true
          },
          {
            headerName:'Process timestamp',
            field: 'processtimestamp',
            filter: true,
            sortable: true,
            sortingOrder: ["asc", "desc"],
            suppressSizeToFit: true,
            resizable: true
          },
          {
            headerName: 'Transaction timestamp',
            field: 'transactiontimestamp',
            filter: true,
            sortable: true,
            sortingOrder: ["asc", "desc"],
            suppressSizeToFit: true,
            resizable: true
          },
          {
            headerName: 'Error code',
            field: 'errorcode',
            filter: true,
            sortable: true,
            sortingOrder: ["asc", "desc"],
            suppressSizeToFit: true,
            resizable: true
          },
          { 
            headerName:'Transrefno',
            field: 'transrefno',
            filter: true,
            sortable: true,
            sortingOrder: ["asc", "desc"],
            suppressSizeToFit: true,
            resizable: true
          },
          {
            headerName:'BIType',
            field: 'bitype',
            filter: true,
            hide: isbillplan,
            sortable: true,
            sortingOrder: ["asc", "desc"],
            suppressSizeToFit: true,
            resizable: true
          },
          {
            headerName: 'Actions',
            field: 'action',
            cellRendererFramework: CellCustomMilestoneComponent,
            filter: true,
            sortable: true,
            sortingOrder: ["asc", "desc"],
            suppressSizeToFit: true,
            resizable: true
          }
        ]
      }
    ];
  }


  onGridReady1(params) {
    this.gridApi = params.api;
    //this.errorTrackingColumns();
    this.hideandshow2();
    this.requestBuilder1()
    params.api.setColumnDefs(this.columnDefs);
    params.api.setRowData([]);
  }


  role: any;
  dashboardDefault() {
    this.dashboard = JSON.parse((CryptoJS.AES.decrypt(sessionStorage.getItem("dashboards"), environment.encryptSecretKey)).toString(CryptoJS.enc.Utf8))
    this.hideandshow2();
    
    // if (this.whichdashboard === undefined || this.whichdashboard === "" || this.whichdashboard === null) {
    //   this.whichdashboard = this.dashboard[0]
    // }
  }

  errorTrackingColumns() {
    //this.dashboardDefault()
    // this.columnobj = {
    //   "dashboard": this.whichdashboard,
    //   "parent": "errorTrackingResponse"
    // }
    // this.columnJson = <JSON>this.columnobj;
    // this.service.errorTrackingColumns(this.columnJson).subscribe(data => {
    //   this.message = data
    //   this.errorTracking = this.message.parent
      
    // })
    // this.whichdashboard = undefined;
  }


  updateRows() {
    this.requestBuilder1()
    if(this.loading){
      this.service.errorTracking(this.jsonRequest).subscribe(data => {
        this.gridApi.setRowData([])
        this.loading = false;
        this.message = data
        var newData = data;
        if (newData[0] !== undefined) {
          this.gridApi.applyTransaction({ add: newData });
        }
        //this.clearVar();
      },error=>{
        alert("request failed")
        this.gridApi.applyTransaction({ add: [] });
      })
    }    
  }
  clearVar() {
    this.businteraction = undefined;
    this.whichdashboard = undefined;
  }


  onSelectionChanged() {
    this.obj1 = {}
    this.jsonRepushRequest = <JSON>this.obj1;
    this.selectedObj = []
    let selectedNodes = this.gridApi.getSelectedNodes();
    let selectedData = selectedNodes.map(node => node.data);
    for (let i = 0; i < selectedData.length; i++) {
      var timepass = {
        "referenceno": selectedData[i].referenceno,
        "interfaceid": selectedData[i].activityname,
        "transrefno": selectedData[i].transrefno,
        "processtimestamp": selectedData[i].processtimestamp,
        "processtype": selectedData[i].processtype
      }
      this.selectedObj.push(timepass)

    }
    
    let chunked: any = []
    let size = environment.replyBatchSize;
    for (let i = 0; i < this.selectedObj.length; i += size) {
      chunked.push(this.selectedObj.slice(i, i + size))
      //console.log(chunked)
      let batch: any = {
        "dashboard": this.whichdashboard,
        "username": this.username,
      }
      batch["requests"] = chunked[0]

      this.service.rePush(batch).subscribe(data => {
        let message:any = data
        const myJSON = JSON.stringify(data);
        var storedreply = localStorage.getItem("reply")
        let combined = storedreply + "," + myJSON
        localStorage.setItem("reply", combined)
        alert(batch.requests.length + " request pushed successfully")
      }, error => {
        this.message = error
        console.error(this.message.error.error)
        alert(this.message.error.error)
      })

      
      chunked = []
    }

    this.gridApi.deselectAll();
    setTimeout(() => {
      let dataresp = this.service.errorTracking(this.jsonRequest);
      dataresp.subscribe(data => {
        this.gridApi.setRowData([])
        this.gridApi.applyTransaction({ add: data });
      },error=>{
        alert("request failed")
        this.gridApi.setRowData([])
      })
    }, 3000);
  }

  replyHistory:any
  openScrollableContent(longContent) {
    this.modalService.open(longContent, { scrollable: true });
    let a = localStorage.getItem("reply")
    
    //a.substring(-1)
    let temp = a.substring(2)
    let first = temp.slice(0, -1)
    this.replyHistory = first
  }

}
