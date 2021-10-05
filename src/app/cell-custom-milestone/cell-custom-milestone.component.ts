import { Component, OnInit, ViewChild } from '@angular/core';
import { RestserviceService } from '../restservice.service';
import { ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { logdates } from '../failure-stats/failure-stats.component';
import { cellCustomComponent } from '../cell-custom/cell-custom.component';
import { createSpinner } from '@syncfusion/ej2-angular-popups';
import * as CryptoJS from 'crypto-js';
import { config, environment } from 'src/environments/environment';


declare var $: any;
@Component({
  selector: 'app-cell-custom-milestone',
  templateUrl: './cell-custom-milestone.component.html',
  styleUrls: ['./cell-custom-milestone.component.css']
})
export class CellCustomMilestoneComponent implements OnInit {
  params: any;
  public data: Object[] = [];
  jsonRequest: JSON
  obj: any;
  message: any;
  request: any;
  processedRequest: any;
  closeResult: string;
  jsonObject: Object[];

  dashboard;
  interfaceid: string;
  processTimeStrap: any;
  processType: any
  referenceno;
  status;
  transrefno;
  transDate;

  stacktrace: any;
  processedlogmessage: any;
  receivedlogmessage: any;
  receivedpayload: any;
  processedpayload: any;
  errorcode: any;
  repushview: boolean = false

  finalObj: any;
  obj1: any;
  jsonRepushRequest: any;
  selectedObj = [];
  //username: string = localStorage.getItem('username');
  usernamep: string = JSON.parse((CryptoJS.AES.decrypt(localStorage.getItem('usernamep'), environment.encryptSecretKey)).toString(CryptoJS.enc.Utf8))
  loading: boolean = false;
  constructor(private modalService: NgbModal, private service: RestserviceService) { }

  ngOnInit(): void {
    //this.requestBuilder()
    //this.data = this.jsonObject    
    //this.jsonObject = []
  }


  // splitData() {
  //   console.log("split date invoked")
  //   //var dataJson = { "lineItems": [{ "processname": "TC_SITBMSS31_004", "processtype": "RECHARGESELF", "processstate": "FAILED", "activities": [{ "processname": "ReceivedRecharge", "activitystate": "COMPLETED", "activitytimestamp": "2021-07-28 16:15:34.206" }, { "processname": "ReplenishBalance", "activitystate": "FAILED", "activitytimestamp": "2021-07-28 16:08:14.027", "errorcode": "8108|Communication Error" }, { "processname": "RechargeAccount", "activitystate": "FAILED", "activitytimestamp": "2021-07-28 16:15:34.858", "errorcode": "UNKNOWN_ERROR|Error setting client id - client id already in use (403: Client Name Already In Use); nested exception is javax.jms.InvalidClientIDException: Error setting client id - client id already in use (403: Client Name Already In Use)" }, { "processname": "NotifyReplenishBalanceStatus", "activitystate": "COMPLETED", "activitytimestamp": "2021-07-28 16:15:38.126" }] }] }
  //   //var dataJson1 = dataJson.lineItems
  //   var dataJson1 = this.processedRequest
  //   console.log(dataJson1)
  //   // dataJson1[0]["activitystate"] = "";
  //   // dataJson1[0]["activitytimestamp"] = "";
  //   this.jsonObject = dataJson1;
  //   this.data = this.jsonObject
  //   //this.data = this.sampleResponse
  //   //console.log(this.jsonObject)
  // }

  processDetailRequestBuilder() {
    this.obj = {
      "dashboard": logdates.logdashboardname,
      "referenceno": cellCustomComponent.referenceno,
      "transrefno": cellCustomComponent.transrefno,
      "transDate": cellCustomComponent.transDate
    }
    this.jsonRequest = <JSON>this.obj;
    if (this.jsonRequest["referenceno"] === null || this.jsonRequest["referenceno"] === undefined || this.jsonRequest["referenceno"] === "") {
      return;
    }
    if (this.jsonRequest["transrefno"] === null || this.jsonRequest["transrefno"] === undefined || this.jsonRequest["transrefno"] === "") {
      return;
    }
    console.log(this.jsonRequest)
    this.requestBuilder()
  }

  requestBuilder() {
    console.log("request builder invoked")
    //this.request = {"dashboard": "recharge", "referenceno": "NID090721002", "transrefno": "1", "transDate": "2019-08-24T18:05:11" }
    //this.jsonRequest = <JSON>this.request
    //this.processDetailRequestBuilder()
    this.service.processDetails(this.jsonRequest).subscribe(data => {
      console.log(data)
      this.loading = false;
      this.message = data
      var dataJson = this.message.lineItems
      var parentNode = this.message.parentNode
      dataJson[0]["activitystate"] = "";
      dataJson[0]["activitytimestamp"] = "";
      dataJson[0].activities.push(parentNode);
      this.processedRequest = dataJson;
      //assigning final data for mapping
      this.data = dataJson;
    },error=>{
      this.loading = false;
      alert("request failed")
      this.data = []
    })
  }

  rowSelected(args) {
    //console.log(args)
    this.message = args.rowData
    console.log(this.message)
  }

  dashboardJson: JSON
  dashboardObj = {}
  repushshow: boolean = false
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
      "dashboard": logdates.logdashboardname,
      "interfaceid": this.interfaceid, "processtimestamp": this.processTimeStrap,
      "processtype": this.processType, "referenceno": this.referenceno, "status": this.status,
      "transrefno": cellCustomComponent.transrefno
    }
    this.jsonRequest = <JSON>this.obj;
    this.repushhideandshow();
    if (this.status === "FAILED" && this.repushflag) {
      this.repushview = true;
    }
    console.log(this.jsonRequest)
  }

  dashboardacesses:any;
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
    console.log(this.dashboardJson[logdates.logdashboardname])
    if (this.dashboardJson[sessionStorage.getItem("defaultdashboard")] === "all") {
      this.repushflag = true;
    }else{
      this.repushflag = false;
    }
    
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  openXl(contentlogs) {
    this.loading = true;
    setTimeout(() => {
      this.processDetailRequestBuilder()
    }, 1000);
    this.repushhideandshow()
    //this.requestBuilder()
    //this.splitData()

    this.modalService.open(contentlogs, { size: 'xl' });

  }

  openXlforLogs(processlogs) {
    this.modalService.open(processlogs, { size: 'xl' });
    this.service.logPayload(this.jsonRequest).subscribe(data => {
      console.log(data)
      this.loadingdetail = false;
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

  agInit(params) {
    this.params = params;
    this.data = params.value;
  }

  repush() {
    this.selectedObj = []
    this.obj1 = {}
    this.jsonRepushRequest = <JSON>this.obj1;

    this.jsonRepushRequest["referenceno"] = cellCustomComponent.referenceno;
    this.jsonRepushRequest["interfaceid"] = this.interfaceid
    this.jsonRepushRequest["transrefno"] = cellCustomComponent.transrefno;
    this.jsonRepushRequest["processtimestamp"] = this.processTimeStrap
    this.jsonRepushRequest["processtype"] = this.processType
    this.selectedObj.push(this.jsonRepushRequest)

    this.finalObj = {
      "dashboard": logdates.logdashboardname,
      "username": this.usernamep
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
      this.processDetailRequestBuilder();
    }, 3000);    
  }
}
