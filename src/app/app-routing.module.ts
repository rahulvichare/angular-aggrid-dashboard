import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { EncryptionComponent } from './encryption/encryption.component';
import { FailureStatsComponent } from './failure-stats/failure-stats.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { MilestoneModalComponent } from './milestone-modal/milestone-modal.component';
import { MilestoneComponent } from './milestone/milestone.component';
import { TestComponent } from './test/test.component';
import { TrackingComponent } from './tracking/tracking.component';


const routes: Routes = [
  {path:"",redirectTo:"login",pathMatch:"full"},
  {path:"home",component:HomeComponent,canActivate:[AuthGuard]},
  {path:"login",component:LoginComponent},
  {path:"error",component:FailureStatsComponent,canActivate:[AuthGuard]},
  {path:"tracking",component:TrackingComponent,canActivate:[AuthGuard]},
  {path:"milestone",component:MilestoneComponent},
  {path:"test",component:TestComponent},
  {path:"milestonemodal",component:MilestoneModalComponent},
  {path:"encryption",component:EncryptionComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
