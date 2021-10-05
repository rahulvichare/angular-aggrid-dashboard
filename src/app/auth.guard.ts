import { Injectable } from '@angular/core';
import { CanActivate, Router} from '@angular/router';
import { RestserviceService } from './restservice.service';
import { environment } from 'src/environments/environment';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  userrole:any;
  constructor(private _authService: RestserviceService, private _router: Router){

  }
  canActivate(): boolean{
    if(this._authService.loggedIn()){
      return true;
    }else{
      this._router.navigate(['/login'])
      return false
    }

  }
  
}
