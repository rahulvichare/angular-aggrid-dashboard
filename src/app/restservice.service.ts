import { Injectable } from '@angular/core';
import 'rxjs/add/observable/throw';
import { environment } from 'src/environments/environment';
import { catchError, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { TestComponent } from './test/test.component';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class RestserviceService {

  private apiServerUrl = environment.processMonitoringUrl;
  private dmcUrl = environment.dmcUrl;
  private pmcLogin = environment.pmcLogin
  private userLogin = environment.userLogin
  private ldapUrl = environment.ldapEndPoint;
  public username: String;
  public password: String;
  resp: string;
  token: string
  roles: string

  constructor(private http: HttpClient, private NgbModal: NgbModal) { }

  pmcUser(username: string) {
    return this.http.get(`${this.userLogin}/loginmybatis/${username}`)
  }

  ldaplogin(username: string, password: string) {
    //const headers = new HttpHeaders({ Authorization: 'Basic ' + btoa(username + ':' + password) });
    var user = {
      "username": username,
      "password": btoa(password)
    }
    return this.http.post(`${this.ldapUrl}`, user)
  }

  dashboardSummary(user) {
    let tokenStr = 'Bearer ' + localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', tokenStr);
    //return this.http.post(`${this.apiServerUrl}/DashboardSummary`,user,{headers})
    return this.http.post(`${this.apiServerUrl}/DashboardSummary`, user, { headers })
  }

  dashboardErrorSummary(user) {
    let tokenStr = 'Bearer ' + localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', tokenStr);
    //return this.http.post(`${this.apiServerUrl}/DashboardErrorSummary`,user,{headers})
    return this.http.post(`${this.apiServerUrl}/DashboardErrorSummary`, user, { headers })
  }

  tracking(user) {
    let tokenStr = 'Bearer ' + localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', tokenStr);
    //return this.http.post(`${this.apiServerUrl}/Tracking`,user,{headers})
    //return this.http.post(`http://localhost:8090/ProcessMonitoring/Tracking`,user,{headers})
    return this.http.post(`${this.apiServerUrl}/Tracking`, user, { headers })
  }

  saveUser(user) {
    let tokenStr = 'Bearer ' + localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', tokenStr);
    return this.http.post(`${this.dmcUrl}/saveuserpmc`, user, { headers })
  }
  


  errorTracking(request) {
    let tokenStr = 'Bearer ' + localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', tokenStr);
    //return this.http.post(`${this.apiServerUrl}/ErrorTracking`,request,{headers})
    return this.http.post(`${this.apiServerUrl}/ErrorTracking`, request, { headers })
  }
  errorTrackingColumns(request) {
    let tokenStr = 'Bearer ' + localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', tokenStr);
    //return this.http.post(`${this.apiServerUrl}/DashboardColumns`,request,{headers})
    return this.http.post(`${this.apiServerUrl}/DashboardColumns`, request, { headers })
  }

  processDetails(request) {
    let tokenStr = 'Bearer ' + localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', tokenStr);
    //return this.http.post(`${this.apiServerUrl}/ProcessDetails`,request,{headers})
    return this.http.post(`${this.apiServerUrl}/ProcessDetails`, request, { headers })
  }

  logPayload(request) {
    let tokenStr = 'Bearer ' + localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', tokenStr);
    //return this.http.post(`${this.apiServerUrl}/Payload`,request,{headers})
    return this.http.post(`${this.apiServerUrl}/Payload`, request, { headers })
  }

  rePush(request) {
    let tokenStr = 'Bearer ' + localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', tokenStr);
    //return this.http.post(`${this.apiServerUrl}/Repush`,request,{headers})
    return this.http.post(`${this.apiServerUrl}/Repush`, request, { headers })
  }

  openDialog() {
    this.NgbModal.open(TestComponent)
  }

  registerforaccess(domain: string, role: string) {
    //const headers = new HttpHeaders({ Authorization: 'Basic ' + btoa(username + ':' + password) });
    var user = {
      "username": domain,
      "roles": role
    }
    return this.http.post(`${this.pmcLogin}/registerforaccessmybatis`, user)
  }

  trackStatus(username: string) {
    return this.http.get(`${this.dmcUrl}/trackstatus/${username}`)
  }

  getalldashboardsbyuser() {
    let username = localStorage.getItem("username")
    return this.http.get(`${this.dmcUrl}/getalldashboardsbyusername/${username}`)
  }

  getdash(username: string) {
    return this.http.get(`${this.dmcUrl}/getalldashboardsbyusername/${username}`)
  }

  getpmcdashboard() {
    let data = localStorage.getItem("usernamep");
    let domain = JSON.parse((CryptoJS.AES.decrypt(data, environment.encryptSecretKey)).toString(CryptoJS.enc.Utf8));
    return this.http.get(`${this.dmcUrl}/getdashboardforshowandhide/${domain}`, { responseType: 'text' })
  }

  setContext(username: string) {
    return this.http.get(`http://localhost:8892/processmonitoring/setContext/${username}`)
  }

  loggedIn() {
    return !!localStorage.getItem("token")
  }

  lineItems(request) {
    let tokenStr = 'Bearer ' + localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', tokenStr);
    return this.http.post(`${this.apiServerUrl}/TrackingLineItems`,request,{headers})
  }

}
