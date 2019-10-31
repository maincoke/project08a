import { Component, OnChanges, AfterViewInit } from '@angular/core';
import { GetSidService } from '../../../services/get-sid.service';
import { ShopCarService } from 'src/app/services/shop-car.service';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.css']
})
export class TopbarComponent implements  OnChanges, AfterViewInit {
  public hideBadge: boolean = this.shopCarSrv.showBadge.getValue();
  public badgeNumb: number = this.shopCarSrv.badgeNum.getValue();
  public numBadge: string = this.badgeNumb.toString();

  constructor(private shopCarSrv: ShopCarService, private userSid: GetSidService) {
    this.shopCarSrv.showBadge.subscribe( badge =>  this.hideBadge = !badge );
    this.shopCarSrv.badgeNum.subscribe( numbdg =>  this.numBadge = numbdg.toString() );
    this.setIconBadge();
    console.log('TopBar--');
  }

  ngAfterViewInit(): void {
    // this.shopCarSrv.ngOnInit();
    // this.setIconBadge();
  }

  ngOnChanges(): void {
    // this.setIconBadge();
  }

  setIconBadge() {
    const sid: string = this.userSid.sendSid();
    let badgenumber = 0;
    this.shopCarSrv.getShopCarData(sid);
    if (!this.shopCarSrv.error && sid) {
      console.log(this.shopCarSrv.getShopCarData(sid));
      console.log(this.shopCarSrv.shopCar);
      // console.log(this.shopCarSrv.shopCar.products.);
      this.shopCarSrv.showBadge.next(false);
      badgenumber = this.shopCarSrv.shopCar.products !== undefined &&
                    this.shopCarSrv.shopCar.products.length > 0 ? this.shopCarSrv.shopCar.products.length : 0;
    }
    this.shopCarSrv.badgeNum.next(badgenumber);
    this.shopCarSrv.showBadge.next(badgenumber > 0 ? true : false);
    console.log(this.numBadge);
    console.log(this.hideBadge);
  }

}
