import { Component, OnInit } from '@angular/core';
import { RestserviceService } from '../restservice.service';
import { Router, ActivatedRoute } from '@angular/router';
import { JwtHelperService } from "@auth0/angular-jwt";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { config, environment } from 'src/environments/environment';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  username = ''
  password = ''
  invalidLogin = false
  message: any
  errorMessage: string
  showError: string
  error: string
  successMessage
  loginSuccess
  tokentemp: string
  ldapauth = false
  ldaplogin = false
  registerUser = true
  userToken: string
  userroles: string
  jwtHelper = new JwtHelperService();
  timeout;
  role: any;
  loading: boolean = false;
  useraccessrole: any;
  domainid: any;
  userMessage: any;
  alert: boolean = false;
  alerttrack: boolean = false;
  loginalert: any
  loginalertshow: boolean = false

  constructor(
    private service: RestserviceService,
    private router: Router,
    private route: ActivatedRoute,
    private modalService: NgbModal
  ) { }

  ngOnInit() {
    //this.onSubmit(this.authRequest);
  }



  //  doLogin(){
  //       let resp = this.service.ldaplogin(this.username, this.password).
  //        subscribe(data => {
  //        console.log(data)
  //        this.message = data
  //        localStorage.setItem("username", this.username)
  //        localStorage.setItem("token", this.message.jwt)   
  //        localStorage.setItem("role", this.message.role)
  //        localStorage.setItem("startDate","2021-07-15 00:00:00.000")
  //        sessionStorage.setItem("startDate","2021-07-15 00:00:00.000")
  //        sessionStorage.setItem("endDate","2021-07-15 23:59:59.999")
  //     },(error : any)=>{
  //        console.log(error)
  //        this.error = error
  //        console.log("error executed")
  //    });
  //  }


  // pmcLogin() {
  //   this.loading = true;
  //   this.service.pmcUser(this.username).subscribe(data1 => {
  //     this.service.ldaplogin(this.username, this.password).subscribe(data => {
  //       this.loading = false;
  //       console.log(data)
  //       this.message = data
  //       this.role = data1;
  //       localStorage.setItem("token", this.message.jwt)
  //       localStorage.setItem("role", this.role.role)
  //       this.router.navigate(["/home"])
  //     }),
  //       error => {
  //         console.log(error)
  //       }
  //   }),
  //     error => {
  //       console.log(error)
  //     }
  // }


  login() {
    this.loading = false;
    this.loginalertshow = false;
    this.service.pmcUser(this.username).subscribe(data => {
      this.loading = false;
      this.message = data;
      try {
        this.loginalertshow = true
        this.loginalert = this.message.resultStatus.errorMessage;
      } catch (e) {
        localStorage.setItem("token", this.message.token)
        localStorage.setItem("reply", "")
        // localStorage.setItem("username", this.message.username)
        localStorage.setItem("usernamep", CryptoJS.AES.encrypt(JSON.stringify(this.message.username), environment.encryptSecretKey).toString())
        this.getAllDashboards()
        this.loading = false;
      }
    },
      error => {
        this.loading = false
        alert("request failed")
        console.log(error)
      })
  }

  setContext() {
    this.service.setContext(this.username).subscribe(data => {
      this.login();
    })
  }

  dashboardaccess() {
    this.service.getpmcdashboard().subscribe(data => {
      if (data !== '') {
        var dashboardaccess = CryptoJS.AES.encrypt(JSON.stringify(data), environment.encryptSecretKey).toString();
        sessionStorage.setItem("dashboardAccess", dashboardaccess);
        this.router.navigate(["/home"])
      } else {
        this.loginalertshow = true
        this.loginalert = "Sorry...You have not assign any dashboard yet";
      }
    }, error => {
      this.loading = false
      alert("request failed")
    })
  }

  ldaprequest() {
    let ldapnotdone = true
    this.loading = true;
    this.service.ldaplogin(this.username, this.password).subscribe(data => {
      ldapnotdone = false;
      this.loginalertshow = false
      this.message = data
      try {
        this.loginalert = this.message.resultStatus.errorMessage;
        this.loginalertshow = true
        this.loading = false;
      } catch (e) {
        this.loginalertshow = false
        this.login();
      }
    }, error => {
      this.loading = false;
      this.loginalertshow = false;
    })

    this.loginalertshow = true
    this.loginalert = "Please wait..LDAP Server running slow"


  }

  getAllDashboards() {
    this.service.getdash(this.username).subscribe(data => {
      var dashboards = CryptoJS.AES.encrypt(JSON.stringify(data), environment.encryptSecretKey).toString();
      sessionStorage.setItem("dashboards", dashboards)
      sessionStorage.setItem("defaultdashboard", data[0])
      //this.setContext();
      this.dashboardaccess();
    }, error => {
      this.loading = false;
      alert("request failed")
    })
  }

  // encryptedtext = ''
  // encryptData() {
  //   try {
  //     let a = CryptoJS.AES.encrypt(JSON.stringify(this.message.role), environment.encryptSecretKey).toString();
  //     this.encryptedtext = a
  //     localStorage.setItem("rolep", a)
  //     console.log(a)
  //   } catch (e) {
  //     console.log(e);
  //   }
  // }

  //  onSubmit(){
  //     this.service.generateToken(this.username,this.password).subscribe(
  //       data => {
  //         this.message = data
  //         console.log(data)
  //         this.userToken = data
  //         //var json = JSON.parse(this.message);
  //         //sessionStorage.setItem("token",json.token)   
  //         //sessionStorage.setItem("roles",json.roles)
  //         sessionStorage.setItem("token",this.userToken) 
  //         //this.timeout = this.jwtHelper.getTokenExpirationDate(sessionStorage.getItem("token"))
  //         //console.log(this.timeout)
  //           this.router.navigate(["/adminhome"])
  //         },
  //       error => {
  //         console.log("fail")
  //         console.log(error)
  //         this.invalidLogin=true
  //         this.errorMessage = error.message
  //         if(error.message.includes("401")){
  //           this.showError = "Bad Credentials"
  //         }else if(error.message.includes("403")){
  //           this.showError = "Sorry...You don't have access"
  //         }else{
  //           this.showError = "Sorry...Internal Error Please try again later"
  //         }
  //       }
  //     ) 
  //  }

  //  login(){

  //  }



  doRegister() {
    this.router.navigate(["/register"])
  }

  imadmin() {
    this.router.navigate(["/admin"])
  }

  openBackDropCustomClass(content) {
    this.modalService.open(content, { backdropClass: 'light-blue-backdrop' });
  }

  registerforaccess() {
    let user = {
      "dashboardname": [],
      "domain": this.domainid,
      "role": "analyst",
      "status": false
    }
    this.service.saveUser(user).subscribe(data => {
      this.alert = true;
      this.message = data
      try {
        this.userMessage = this.message.resultStatus.errorMessage
        this.alert = true;
        setTimeout(() => {
          this.alert = false;
        }, 3000)
      } catch (e) {
        this.userMessage = "Registerd successfully"
        setTimeout(() => {
          this.alert = false;
        }, 3000)
      }
    }, error => {
      this.loading = false;
      alert("request failed")
      this.alert = true;
      this.userMessage = "Internal error"
      setTimeout(() => {
        this.alert = false;
      }, 3000)
    })
  }

  trackStatus() {
    this.service.trackStatus(this.domainid).subscribe(data => {

      console.log(data)
      if (data === true) {
        this.alerttrack = true;
        this.userMessage = "User Activation is Successfull"
        setTimeout(() => {
          this.alerttrack = false;
        }, 3000)
      } else {
        this.alerttrack = true;
        try {
          this.message = data
          this.userMessage = this.message.resultStatus.errorMessage
        } catch (e) {
          this.userMessage = "User Activation is Pending"
        }
        setTimeout(() => {
          this.alerttrack = false;
        }, 3000)
      }
    }, error => {
      this.loading = false;
      this.alerttrack = true;
      this.userMessage = "Sorry we could not find entered domainId in our database"
      setTimeout(() => {
        this.alerttrack = false;
      }, 3000)
      console.log(error)
    })
  }

}
