import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { HostListener} from '@angular/core';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { interval, Subscription } from 'rxjs';
import { RestserviceService } from './restservice.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {

  public browserRefresh: boolean;
  isnotLogout:boolean = true;
  userActivity;
  userInactive: Subject<any> = new Subject();
  subscription: Subscription;

  constructor(private router:Router,private _authService: RestserviceService,) {
  }

  ngOnInit(): void {
    this.userInactive.subscribe(data=>{
      this.logout();
      alert("Session Expired")
    });
  }

  logout() {
    this.isnotLogout = false;
    localStorage.removeItem("token")
    localStorage.removeItem("rolep")
    localStorage.removeItem("usernamep")
    sessionStorage.removeItem("dashboardAccess")
    sessionStorage.removeItem("dashboards")
    this.router.navigate(['']).then(() => {
      window.location.reload();
    });
  }

  setTimeout() {
    this.userActivity = setTimeout(() => this.userInactive.next(undefined), environment.idleSessionExpired);
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


}