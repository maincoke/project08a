import { Component, AfterContentInit } from '@angular/core';
import { GetSidService } from '../../../services/get-sid.service';
import { ShopCarService } from 'src/app/services/shop-car.service';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.css']
})
export class TopbarComponent implements AfterContentInit {
  public hideBadge: boolean = this.shopCar.showBadge.getValue();
  public numBadge: string; //  = this.shopCar.badgeNum !== undefined && this.shopCar.badgeNum !== 0 ? this.shopCar.badgeNum.toString() : '0';

  constructor(private shopCar: ShopCarService, private userSid: GetSidService) {
    this.shopCar.showBadge.subscribe( badge =>  this.hideBadge = !badge );
    this.numBadge = this.shopCar.badgeNum !== undefined && this.shopCar.badgeNum !== 0 ? this.shopCar.badgeNum.toString() : '0';
  }

  ngAfterContentInit(): void {
    const sid: string = this.userSid.sendSid();
    this.shopCar.getShopCarData(sid);
    if (!this.shopCar.error && sid) {
      console.log(this.shopCar.error + ' - Top-Bar - ' + sid);
      console.log(this.shopCar.shopCar);
      console.log(this.shopCar.userCar);
    }
    this.setIconBadge();
  }

  setIconBadge() {
    this.shopCar.showBadge.next(false);
    this.numBadge = this.shopCar.badgeNum !== undefined && this.shopCar.badgeNum !== 0 ? this.shopCar.badgeNum.toString() : '0';
    this.shopCar.showBadge.next(this.numBadge === '0' ? false : true);
    console.log(this.shopCar.badgeNum);
    console.log(this.numBadge);
    console.log(this.hideBadge);
  }

}
