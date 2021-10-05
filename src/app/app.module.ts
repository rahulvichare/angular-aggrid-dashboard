import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AgGridModule } from 'ag-grid-angular';
import { HttpClientModule } from '@angular/common/http';
import { DateRangePickerModule } from '@syncfusion/ej2-angular-calendars';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { FormsModule,ReactiveFormsModule  } from '@angular/forms';
import { FailureStatsComponent } from './failure-stats/failure-stats.component';
import { TrackingComponent } from './tracking/tracking.component';
import { CellCustomComponent } from './cell-custom/cell-custom.component';
import { MilestoneComponent } from './milestone/milestone.component';
import { TreeGridModule } from '@syncfusion/ej2-angular-treegrid';
import { CellCustomMilestoneComponent } from './cell-custom-milestone/cell-custom-milestone.component';
import { TestComponent } from './test/test.component';
import { MilestoneModalComponent } from './milestone-modal/milestone-modal.component';
import { DlDateTimeDateModule, DlDateTimePickerModule } from 'angular-bootstrap-datetimepicker';
import { TimePickerModule } from '@syncfusion/ej2-angular-calendars';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { ModalModule } from 'ng-modal-lib';
import { EncryptionComponent } from './encryption/encryption.component';
import { ProcessDetailsTrackingComponent } from './process-details-tracking/process-details-tracking.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    FailureStatsComponent,
    TrackingComponent,
    CellCustomComponent,
    MilestoneComponent,
    CellCustomMilestoneComponent,
    TestComponent,
    MilestoneModalComponent,
    EncryptionComponent,
    ProcessDetailsTrackingComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NgbModule,
    DateRangePickerModule,
    AgGridModule.withComponents([CellCustomComponent]),
    HttpClientModule,
    FormsModule,
    TreeGridModule,
    DlDateTimeDateModule,  // <--- Determines the data type of the model
    DlDateTimePickerModule,
    ReactiveFormsModule,
    TimePickerModule,
    MatProgressBarModule,
    ModalModule
  ],
  providers: [],
  entryComponents: [CellCustomComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
