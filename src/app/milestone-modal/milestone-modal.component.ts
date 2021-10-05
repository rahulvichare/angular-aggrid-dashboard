import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HomeComponent } from '../home/home.component';
import { config, environment } from 'src/environments/environment';
import { logdates } from '../failure-stats/failure-stats.component';
import { RestserviceService } from '../restservice.service';
import { CellCustomMilestoneComponent } from '../cell-custom-milestone/cell-custom-milestone.component';
import { AppRoutingModule } from '../app-routing.module';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { cellCustomComponent } from '../cell-custom/cell-custom.component';
import * as CryptoJS from 'crypto-js';
declare var $: any;

@Component({
  selector: 'app-milestone-modal',
  templateUrl: './milestone-modal.component.html',
  styleUrls: ['./milestone-modal.component.css']
})


export class MilestoneModalComponent implements OnInit {

  recharge: boolean = false;
  billplanchange: boolean = false;
  dealerorder: boolean = false;
  tpdigitalservice: boolean = false;
  digitalplanconfiguration: boolean = false;
  entplanconfiguration: boolean = false;
  reconnection: boolean = false;

  public whichdashboard: any;
  public activityname: any;
  public fromtimestamp: any;
  public totimestamp: any;
  public numberofrows: any;
  public businteraction: any;

  dashboard: any;
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
  public transrefno: any;
  public referenceno: any;
  public transdate: any;
  processedRequest: any;
  jsonObject: Object[];
  data: any;

  interfaceid: string;
  processTimeStrap: any;
  processType: any
  referencenod;
  status;
  transrefnod;
  transDate;

  stacktrace: any;
  processedlogmessage: any;
  receivedlogmessage: any;
  receivedpayload: any;
  processedpayload: any;
  errorcode: any;

  time1 = { hour: 0, minute: 0 };
  time2 = { hour: 23, minute: 59 };


  filter: any = HomeComponent;
  repushview: boolean = false

  constructor(private service: RestserviceService, private modalService: NgbModal) {
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
    this.hideandshow2()
  }

  clickButton(e) {
    //   setTimeout( () => {
    //     this.processDetailRequestBuilder()
    // }, 1000);

    e.show()
  }

  // processDetailRequestBuilder(){
  //   this.obj = {
  //     "dashboard": logdates.logdashboardname,
  //     "referenceno":  cellCustomComponent.referenceno, 
  //     "transrefno": cellCustomComponent.transrefno,
  //     "transDate": cellCustomComponent.transDate
  //   }
  //   this.jsonRequest = <JSON>this.obj;
  //   console.log(this.jsonRequest)
  //   this.requestBuilder()
  // }

  requestBuilder() {
    console.log("3. request builder invoked")
    //this.request = {"dashboard": "recharge", "referenceno": "NID090721002", "transrefno": "1", "transDate": "2019-08-24T18:05:11" }
    //this.jsonRequest = <JSON>this.request
    //this.processDetailRequestBuilder()    
    if (this.loading) {
      try{
        this.service.processDetails(this.jsonRequest).subscribe(data => {
          this.loading = false;
          this.message = data
          var dataJson = this.message.lineItems
          if (dataJson !== undefined) {
            dataJson[0]["activitystate"] = "";
            dataJson[0]["activitytimestamp"] = "";
            //this.processedRequest = dataJson;
            console.log(dataJson)
            this.data = dataJson;
          }else{
            this.loading = false;
            this.data = [];
            alert("No records found")
          }
        },error=>{
          this.data = []
          console.log(error)
          alert(error.message)
        })
      }catch(e){
        this.loading = false;
        alert("Internal Server Error")
      }
    }
  }

  // splitData() {
  //   console.log("4. split date invoked")
  //   //var dataJson = { "lineItems": [{ "processname": "TC_SITBMSS31_004", "processtype": "RECHARGESELF", "processstate": "FAILED", "activities": [{ "processname": "ReceivedRecharge", "activitystate": "COMPLETED", "activitytimestamp": "2021-07-28 16:15:34.206" }, { "processname": "ReplenishBalance", "activitystate": "FAILED", "activitytimestamp": "2021-07-28 16:08:14.027", "errorcode": "8108|Communication Error" }, { "processname": "RechargeAccount", "activitystate": "FAILED", "activitytimestamp": "2021-07-28 16:15:34.858", "errorcode": "UNKNOWN_ERROR|Error setting client id - client id already in use (403: Client Name Already In Use); nested exception is javax.jms.InvalidClientIDException: Error setting client id - client id already in use (403: Client Name Already In Use)" }, { "processname": "NotifyReplenishBalanceStatus", "activitystate": "COMPLETED", "activitytimestamp": "2021-07-28 16:15:38.126" }] }] }
  //   //var dataJson1 = dataJson.lineItems
  //   var dataJson1 = this.processedRequest
  //   console.log(dataJson1)
  //   dataJson1[0]["activitystate"] = "";
  //   dataJson1[0]["activitytimestamp"] = "";
  //   this.jsonObject = dataJson1;
  //   this.data = this.jsonObject
  //   //this.data = this.sampleResponse
  //   //console.log(this.jsonObject)
  // }

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
  }


  storedRole: any
  hideandshow2() {
    console.log("function eekldjslj")
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



  // requestBuilder() {
  //   let rowData = this.params;
  //   let i = rowData.data;
  //   let errorcode = i.errorcode
  //   var newarr = errorcode.split("-");
  //   var errorResult = newarr[0]
  //   this.obj = {
  //     "dashboard": logdates.logdashboardname,
  //     "fromtimestamp": logdates.logstartDate,
  //     "totimestamp": logdates.logendDate,
  //     "activityname": i.activityname,
  //   }
  //   this.jsonRequest = <JSON>this.obj;
  //   if (errorResult !== undefined && errorResult !== "") {
  //     this.jsonRequest["errorcode"] = errorResult;
  //   }
  //   console.log(this.jsonRequest);
  // }

  requestBuilder1() {
    this.loading = true;
    this.filter = ""
    this.obj = {}
    this.jsonRequest = <JSON>this.obj;
    if (this.whichdashboard !== undefined && this.whichdashboard !== null && this.whichdashboard !== "") {
      this.jsonRequest["dashboard"] = this.whichdashboard;
    } else {
      this.loading = false;
      alert("Please select dashboard");
      return;
    }
    if (this.referenceno !== undefined && this.referenceno !== null && this.referenceno !== "") {
      this.jsonRequest["referenceno"] = this.referenceno;
    } else {
      this.loading = false;
      alert("Please Enter reference number");
      return;
    }

    if(this.whichdashboard !== "billplanchange"){
      if (this.transrefno !== undefined && this.transrefno !== null && this.transrefno !== "") {
        this.jsonRequest["transrefno"] = this.transrefno;
      }
      else{
        this.jsonRequest["transrefno"] = "";
        // this.loading = false;
        // alert("Please Enter transfer number");
        // return;
      }
    }
    
    if (this.transdate !== undefined && this.transdate !== null && this.transdate !== "") {
      this.jsonRequest["transDate"] = this.transdate;
    }else{
      this.jsonRequest["transDate"] = ""
    }
    console.log("2. requestBuilder1 executed")
    console.log(this.jsonRequest)
    this.requestBuilder()
  }

  openXlforLogs(processlogs) {
    this.modalService.open(processlogs, { size: 'xl' });
    this.service.logPayload(this.jsonRequest).subscribe(data => {
      this.loadingdetail = false;
      this.loading = false;
      console.log(data)
      this.message = data;
      this.stacktrace = this.message.stacktrace;
      this.errorcode = this.message.errorcode;
      this.processedlogmessage = this.message.processedlogmessage;
      this.processedpayload = this.message.processedpayload;
      this.receivedlogmessage = this.message.receivedlogmessage;
      this.receivedpayload = this.message.receivedpayload;
    }, error => {
      alert("request failed")
      console.log(error)
    })
  }

  loadingdetail:boolean = false;
  errorCodeDetails:string
  Doubleclick(args) {
    this.loadingdetail = true;
    this.repushview = false
    this.message = args.rowData
    this.interfaceid = this.message.processname
    this.processTimeStrap = this.message.activitytimestamp
    this.processType = this.message.parentItem.processtype
    this.referenceno = this.message.parentItem.processname
    this.status = this.message.activitystate
    this.errorCodeDetails = this.message.errorcode
    this.obj = {
      "dashboard": this.whichdashboard,
      "interfaceid": this.interfaceid, "processtimestamp": this.processTimeStrap,
      "processtype": this.processType, "referenceno": this.referenceno, "status": this.status,
      "transrefno": this.transrefno
    }
    this.jsonRequest = <JSON>this.obj;
    this.repushhideandshow()
    if (this.status === "FAILED" && this.repushflag) {
      this.repushview = true;
    }
    console.log(this.jsonRequest)
  }


  finalObj: any;
  obj1: any;
  jsonRepushRequest: any;
  selectedObj = [];
  repush() {
    this.selectedObj = []
    this.obj1 = {}
    this.jsonRepushRequest = <JSON>this.obj1;

    this.jsonRepushRequest["referenceno"] = this.referenceno;
    this.jsonRepushRequest["interfaceid"] = this.interfaceid
    this.jsonRepushRequest["transrefno"] = this.transrefno;
    this.jsonRepushRequest["processtimestamp"] = this.processTimeStrap
    this.jsonRepushRequest["processtype"] = this.processType
    this.selectedObj.push(this.jsonRepushRequest)


    this.finalObj = {
      "dashboard": this.whichdashboard,
      "username": JSON.parse((CryptoJS.AES.decrypt(localStorage.getItem('usernamep'), environment.encryptSecretKey)).toString(CryptoJS.enc.Utf8))
    }
    this.finalObj["requests"] = this.selectedObj
    this.service.rePush(this.finalObj).subscribe(data => {
      console.log(data)
      alert("Data Submitted Successfully")
    }, error => {
      this.message = error
      console.error(this.message.error.error)
      alert(this.message.error.error)
    })
    setTimeout(() => {
      this.requestBuilder1();
    }, 3000);  
    
  }

  dashboardObj = {}
  dashboardJson: JSON
  dashboardacesses: any;
  repushflag = false;
  repushhideandshow() {
    this.dashboardJson = <JSON>this.dashboardObj
    let data = JSON.parse((CryptoJS.AES.decrypt(sessionStorage.getItem("dashboardAccess"), environment.encryptSecretKey)).toString(CryptoJS.enc.Utf8))
    console.log(data)
    var splitdashboards = data.split(",");
    splitdashboards.forEach(dashboard => {
      var splitagain = dashboard.split("-")
      this.dashboardJson[splitagain[0]] = splitagain[1]
    })
    console.log(this.dashboardJson)
    console.log(this.dashboardJson[this.whichdashboard])
    if (this.dashboardJson[this.whichdashboard] === "all") {
      this.repushflag = true;
    } else {
      this.repushflag = false;
    }

  }


  tempFunc() {
    this.obj = { "dashboard": "recharge", "fromtimestamp": "2021-07-07 00:00:00.000", "totimestamp": "2021-08-05 23:59:59.999", "activityname": "ActivateDigitalService", "errorcode": "8108" }
    this.jsonRequest = <JSON>this.obj;
  }




  updateRows() {
    console.log("1.update row clicked")
    this.requestBuilder1()
  }
  clearVar() {

    this.businteraction = undefined;
    this.whichdashboard = undefined;

    console.log("cleared variables")
  }

  testme() {
    console.log(this.dateRanage)
  }

  getToday(): string {
    return new Date().toISOString().split('T')[0]
  }

}
