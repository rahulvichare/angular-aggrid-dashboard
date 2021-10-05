import { Component, OnInit } from '@angular/core';
import { closest } from '@syncfusion/ej2-base';
import { EditSettingsModel, ToolbarItems } from '@syncfusion/ej2-angular-treegrid';
import { TreeGridComponent } from '@syncfusion/ej2-angular-treegrid';
//import { CommandModel} from '@syncfusion/ej2-angular-treegrid';
import { ViewChild } from '@angular/core';



@Component({
  selector: 'app-milestone',
  templateUrl: './milestone.component.html',
  styleUrls: ['./milestone.component.css']
})
export class MilestoneComponent implements OnInit {
  public data: Object[];
  jsonObject: Object[];
  jsonResponse: any;
  public editSettings: EditSettingsModel;
  public toolbarOptions: ToolbarItems[];
  

  @ViewChild('treegrid')
  public treeGridObj: TreeGridComponent;

  public onClick = (args: Event) => {
    let rowIndex: number = (<HTMLTableRowElement>closest(args.target as Element, '.e-row')).rowIndex;
    let data: Object = this.treeGridObj.getCurrentViewRecords();
    alert(JSON.stringify(data[rowIndex]));
    }

  constructor() { }

  ngOnInit(): void {
    this.splitData()
    this.data = this.jsonObject
    this.editSettings = { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Row' };
    this.toolbarOptions = ['Add', 'Edit', 'Delete', 'Update', 'Cancel'];
    
    this.jsonObject = []
  }

  splitData() {
    var dataJson = { "lineItems": [{ "processname": "TC_SITBMSS31_004", "processtype": "RECHARGESELF", "processstate": "FAILED", "activities": [{ "processname": "ReceivedRecharge", "activitystate": "COMPLETED", "activitytimestamp": "2021-07-28 16:15:34.206" }, { "processname": "ReplenishBalance", "activitystate": "FAILED", "activitytimestamp": "2021-07-28 16:08:14.027", "errorcode": "8108|Communication Error" }, { "processname": "RechargeAccount", "activitystate": "FAILED", "activitytimestamp": "2021-07-28 16:15:34.858", "errorcode": "UNKNOWN_ERROR|Error setting client id - client id already in use (403: Client Name Already In Use); nested exception is javax.jms.InvalidClientIDException: Error setting client id - client id already in use (403: Client Name Already In Use)" }, { "processname": "NotifyReplenishBalanceStatus", "activitystate": "COMPLETED", "activitytimestamp": "2021-07-28 16:15:38.126" }] }] }
    var dataJson1 = dataJson.lineItems
    dataJson1[0]["activitystate"] = "";
    dataJson1[0]["activitytimestamp"] = "";
    this.jsonObject = dataJson1;
    console.log(this.jsonObject)
  }

  rowSelected(args) {
    console.log(args)
    //alert('row index: ' + args.row.getAttribute('aria-rowindex'));
    //alert('column index: ' + args.target.getAttribute('aria-colindex'));
}


}
