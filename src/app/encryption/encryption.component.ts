import { Component, OnInit } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-encryption',
  templateUrl: './encryption.component.html',
  styleUrls: ['./encryption.component.css']
})
export class EncryptionComponent implements OnInit {

  encryptSecretKey = "test"
  data = "rahul"
  encryptedtext = ''
  encryptData() {
    try {
      let a = CryptoJS.AES.encrypt(JSON.stringify(this.data), this.encryptSecretKey).toString();
      this.encryptedtext = a
      console.log(a)
    } catch (e) {
      console.log(e);
    }
  }


  decryptData() {

    try {
      const bytes = CryptoJS.AES.decrypt(this.encryptedtext, this.encryptSecretKey);
      if (bytes.toString()) {
        //return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        console.log(JSON.parse(bytes.toString(CryptoJS.enc.Utf8)))
      }
      
    } catch (e) {
      console.log(e);
    }
  }

  constructor() { }

  ngOnInit(): void {
  }

}
