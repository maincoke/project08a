import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GetSidService {
  private userSid: string;
  constructor() { }

  sendSid() {
    this.userSid = sessionStorage.getItem('shopsid') !== null && sessionStorage.getItem('shopsid') !== undefined ?
                  sessionStorage.getItem('shopsid') : null;
    return this.userSid;
  }

  clearSid() {
    sessionStorage.removeItem('shopsid');
  }
}
