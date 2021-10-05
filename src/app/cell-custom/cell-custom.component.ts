import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { RestserviceService } from '../restservice.service';
import { logdates } from '../failure-stats/failure-stats.component';
import { CellCustomMilestoneComponent } from '../cell-custom-milestone/cell-custom-milestone.component';
import * as CryptoJS from 'crypto-js';
import { config, environment } from 'src/environments/environment';
import { Subject } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { interval, Subscription } from 'rxjs';
declare var $: any;
export var cellCustomComponent = {
  transrefno: "",
  referenceno: "",
  transDate: ""
};

@Component({
  selector: 'app-cell-custom',
  templateUrl: './cell-custom.component.html',
  styleUrls: ['./cell-custom.component.css']
})
export class CellCustomComponent implements OnInit {
  data: any;
  params: any;
  closeResult = '';
  activityName: any;
  error: any;
  errormessage: any;
  activityCount: any;
  public defaultColDef;
  private gridApi;
  columnDefs = [];
  users: any;
  jsonRequest: JSON;
  columnJson: JSON;
  jsonRepushRequest: any;
  obj: any;
  obj1: any;
  columnobj: any;
  message: any;
  errorTracking = [];
  selectobj: any;
  selectJson: JSON;
  selectedObj = [];
  finalObj: any;
  private gridColumnApi;
  username: string = JSON.parse((CryptoJS.AES.decrypt(localStorage.getItem('usernamep'), environment.encryptSecretKey)).toString(CryptoJS.enc.Utf8))
  paginationPageSize: any;
  subscription: Subscription;


  constructor(
    private modalService: NgbModal,
    private http: HttpClient,
    private router: Router,
    private service: RestserviceService
  ) {

    this.paginationPageSize = 17;
    this.defaultColDef = {
      flex: 1,
      minWidth: 100,
      enableValue: true,
      enableRowGroup: true,
      enablePivot: true,
      sortable: true,
      filter: true,
    };
  }

  onGridReady(params) {
    this.requestBuilder()
    this.gridApi = params.api;
    //this.gridColumnApi = params.columnApi;
    //params.api.sizeColumnsToFit();
    params.api.setColumnDefs(this.columnDefs);
    let dataresp = this.service.errorTracking(this.jsonRequest);
    dataresp.subscribe(data => {
      params.api.setRowData(data);
    },error=>{
      alert("Request failed")
      params.api.setRowData([]);
    })
  }

  errorTrackingColumns() {

  }
  // onGridReady(params) {
  //   this.requestBuilder()
  //   this.gridApi = params.api;
  //   //this.gridColumnApi = params.columnApi;
  //   //params.api.sizeColumnsToFit();
  //   let dataresp = this.service.tracking(this.jsonRequest);
  //   dataresp.subscribe(data => {
  //     console.log("data received");
  //     this.message = data
  //     console.log(data);
  //     var abc = data[0];
  //     console.log("abc is");
  //     console.log(abc)
  //     if (abc === undefined) {
  //       for (var key in this.message.resultStatus) {
  //         this.columnDefs.push({
  //           headerName: key, field: key
  //         })
  //         params.api.setColumnDefs(this.columnDefs);
  //       }
  //       this.users = data
  //       //console.log(this.users)
  //       this.users = this.message.resultStatus
  //       //console.log(this.users) 
  //       const usersJson: any[] = Array.of(this.users);
  //       //console.log(usersJson)
  //       params.api.setRowData(this.users = usersJson);
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

  agInit(params) {
    this.params = params;
    this.data = params.value;
  }

  editRow() {
    let rowData = this.params;
    let i = rowData.data;
    console.log(i);
  }

  refresh(params?: any): boolean {
    return true;
  }
  onClick($event) {
    if (this.params.onClick instanceof Function) {
      // put anything into params u want pass into parents component
      const params = {
        event: $event,
        rowData: this.params.node.data
        // ...something
      }
      this.params.onClick(params);

    }
  }

  onRowClicked(args) {
    cellCustomComponent.transrefno = args.data.transrefno
    console.log(cellCustomComponent.transrefno)
    cellCustomComponent.referenceno = args.data.referenceno
    console.log(cellCustomComponent.referenceno)
    cellCustomComponent.transDate = args.data.transactiontimestamp
    console.log(cellCustomComponent.transDate)
    console.log("on row clicked on cell custom componet set varialbles")
  }

  open(content) {
    console.log("view clicked")
    this.showData()
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  openXl(contentlogs) {
    this.repushhideandshow()
    this.modalService.open(contentlogs, { size: 'xl', scrollable: true });
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

  showData() {
    let rowData = this.params;
    let i = rowData.data;
    this.activityName = i.activityname
    this.error = i.errorcode
    this.errormessage = i.errormessage
    this.activityCount = i.total
    console.log(this.activityCount)
  }

  ngOnInit(): void { }

  private rowSelection;
  private isRowSelectable;
  requestBuilder() {
    let rowData = this.params;
    let i = rowData.data;
    let errorcode = i.errorcode
    var newarr = errorcode.split("-");
    var errorResult = newarr[0]
    this.obj = {
      "dashboard": logdates.logdashboardname,
      "fromtimestamp": logdates.logstartDate,
      "totimestamp": logdates.logendDate,
      "activityname": i.activityname,
    }
    this.jsonRequest = <JSON>this.obj;
    if (errorResult !== undefined && errorResult !== "") {
      this.jsonRequest["errorcode"] = errorResult;
    }
    console.log(this.jsonRequest);
    let isbillplan = true;
    if (logdates.logdashboardname === "billplanchange") {
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
            headerName: 'Process timestamp',
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
            headerName: 'Transrefno',
            field: 'transrefno',
            filter: true,
            sortable: true,
            sortingOrder: ["asc", "desc"],
            suppressSizeToFit: true,
            resizable: true
          },
          {
            headerName: 'BIType',
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
    this.rowSelection = 'multiple';
    this.isRowSelectable = function (rowNode) {
      console.log(rowNode)
      return rowNode.data ? rowNode.data.errorcode === '2001' : false;
    };
  }

  onSelectionChanged() {
    this.obj1 = {}
    this.jsonRepushRequest = <JSON>this.obj1;
    this.selectedObj = []
    let selectedNodes = this.gridApi.getSelectedNodes();
    let selectedData = selectedNodes.map(node => node.data);
    console.log("all data")
    console.log(selectedData)
    for (let i = 0; i < selectedData.length; i++) {
      var timepass = {
        "referenceno": selectedData[i].referenceno,
        "interfaceid": selectedData[i].activityname,
        "transrefno": selectedData[i].transrefno,
        "processtimestamp": selectedData[i].processtimestamp,
        "processtype": selectedData[i].processtype
      }
      this.selectedObj.push(timepass)
      console.log(this.selectedObj)
    }
    console.log("filter data")
    console.log(this.selectedObj)

    
    let chunked: any = []
    let size = environment.replyBatchSize;
    for (let i = 0; i < this.selectedObj.length; i += size) {
      chunked.push(this.selectedObj.slice(i, i + size))
      //console.log(chunked)
      let batch: any = {
        "dashboard": logdates.logdashboardname,
        "username": this.username,
      }
      batch["requests"] = chunked[0]
      console.log(batch)

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
        alert("Request failed")
        this.gridApi.setRowData([])
      })
    }, 3000);
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
      console.log(this.dashboardJson[logdates.logdashboardname])
      if (this.dashboardJson[logdates.logdashboardname] === "all") {
        this.repushshow = true;
      } else {
        this.repushshow = false;
      }
    },error=>{
      alert("request failed")
    })
  }

  replyHistory:any
  openScrollableContent(longContent) {
    this.modalService.open(longContent, { scrollable: true });
    let a = localStorage.getItem("reply")    
    let temp = a.substring(2)
    let first = temp.slice(0, -1)
    this.replyHistory = first
  }

}
