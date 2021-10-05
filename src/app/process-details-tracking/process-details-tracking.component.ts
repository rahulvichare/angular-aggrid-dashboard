import { Component, OnInit } from '@angular/core';
import { RestserviceService } from '../restservice.service';
import * as CryptoJS from 'crypto-js';
import { config, environment } from 'src/environments/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { trackingvariables } from '../tracking/tracking.component';
@Component({
  selector: 'app-process-details-tracking',
  templateUrl: './process-details-tracking.component.html',
  styleUrls: ['./process-details-tracking.component.css']
})
export class ProcessDetailsTrackingComponent implements OnInit {
  loading: boolean = false;
  jsonRequest: JSON
  obj: any;
  message: any;
  processedRequest: any;
  jsonObject: Object[];
  public data: Object[] = [];
  params: any;

  constructor(private service: RestserviceService, private modalService: NgbModal) { }

  ngOnInit(): void {
  }

  agInit(params) {
    this.data= undefined;
    this.params = params;
    this.data = params.value;
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

  dashboardJson: JSON
  dashboardObj = {}
  repushshow: boolean = false
  repushview: boolean = false
  interfaceid: string;
  processTimeStrap: any;
  processType: any
  referenceno;
  errorCodeDetails:string
  status;
  loadingdetail: boolean = false;
  Doubleclick(args) {
    this.loadingdetail = true;
    console.log(args)
    this.repushview = false
    this.message = args.rowData
    this.interfaceid = this.message.processname
    this.processTimeStrap = this.message.activitytimestamp
    this.processType = this.message.parentItem.processtype
    this.referenceno = this.message.parentItem.processname
    this.status = this.message.activitystate
    this.errorCodeDetails = this.message.errorcode
    this.obj = {
      "dashboard": sessionStorage.getItem("defaultdashboard"),
      "interfaceid": this.interfaceid,
      "processtimestamp": this.processTimeStrap,
      "processtype": this.processType,
      "referenceno": this.referenceno,
      "status": this.status,
      "transrefno": trackingvariables.trackingtransrefno
    }
    this.jsonRequest = <JSON>this.obj;
    this.repushhideandshow();
    if (this.status === "FAILED" && this.repushflag) {
      this.repushview = true;
    }
    console.log(this.jsonRequest)
  }


  stacktrace: any;
  processedlogmessage: any;
  receivedlogmessage: any;
  receivedpayload: any;
  processedpayload: any;
  errorcode: any;
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

  processDetailRequestBuilder() {
    this.obj = {
      "dashboard": sessionStorage.getItem("defaultdashboard"),
      "referenceno": trackingvariables.trackingreferenceno,
      "transrefno": trackingvariables.trackingtransrefno,
      "transDate": trackingvariables.trackingtransDate
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
    this.loading = true;
    console.log("request builder invoked")
    //this.request = {"dashboard": "recharge", "referenceno": "NID090721002", "transrefno": "1", "transDate": "2019-08-24T18:05:11" }
    //this.jsonRequest = <JSON>this.request
    //this.processDetailRequestBuilder()
    this.service.processDetails(this.jsonRequest).subscribe(data => {
      this.loading = false;
      this.message = data
      var dataJson = this.message.lineItems
      dataJson[0]["activitystate"] = "";
      dataJson[0]["activitytimestamp"] = "";
      this.data = dataJson;
    },error=>{
      alert("request failed")
      this.loading = false;
      this.data = []
    })
  }

  // splitData() {
  //   console.log("split date invoked")
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
    if (this.dashboardJson[sessionStorage.getItem("defaultdashboard")] === "all" && sessionStorage.getItem("defaultdashboard") !== "billplanchange") {
      this.repushflag = true;
    } else {
      this.repushflag = false;
    }

  }

  selectedObj = [];
  finalObj: any;
  obj1: any;
  jsonRepushRequest: any;
  usernamep: string = JSON.parse((CryptoJS.AES.decrypt(localStorage.getItem('usernamep'), environment.encryptSecretKey)).toString(CryptoJS.enc.Utf8))
  repush() {
    this.selectedObj = []
    this.obj1 = {}
    this.jsonRepushRequest = <JSON>this.obj1;

    this.jsonRepushRequest["referenceno"] = trackingvariables.trackingreferenceno,
      this.jsonRepushRequest["interfaceid"] = this.interfaceid
    this.jsonRepushRequest["transrefno"] = trackingvariables.trackingtransrefno
    this.jsonRepushRequest["processtimestamp"] = this.processTimeStrap
    this.jsonRepushRequest["processtype"] = this.processType
    this.selectedObj.push(this.jsonRepushRequest)

    this.finalObj = {
      "dashboard": sessionStorage.getItem("defaultdashboard"),
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


