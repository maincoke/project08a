import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GetSidService {
  private userSid: string = sessionStorage.getItem('shopsid') != null ? sessionStorage.getItem('shopsid') : null;
  constructor() { }

  sendSid() {
    return this.userSid;
  }

  clearSid() {
    sessionStorage.removeItem('shopsid');
  }
}
