import { Component, OnChanges, OnInit } from '@angular/core';
import { GetSidService } from '../../../services/get-sid.service';
import { ShopCarService } from 'src/app/services/shop-car.service';
import { DataService } from 'src/app/services/data-service.service';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.css']
})
export class TopbarComponent implements OnInit, OnChanges {
  public hideBadge: boolean = this.shopCarSrv.showBadge.getValue();
  public badgeNumb: number = this.shopCarSrv.badgeNum.getValue();
  public numBadge: string = this.badgeNumb.toString();

  constructor(private shopCarSrv: ShopCarService, private userSid: GetSidService, private dataService: DataService) {
    this.shopCarSrv.showBadge.subscribe( badge =>  this.hideBadge = !badge );
    this.shopCarSrv.badgeNum.subscribe( numbdg =>  this.numBadge = numbdg.toString() );
  }

  ngOnInit(): void {
    this.setIconBadge();
  }

  ngOnChanges(): void {
    this.setIconBadge();
  }

  setIconBadge() {
    const sid: string = this.userSid.sendSid();
    let badgenumber = 0; let response: any;
    const shopCar = this.dataService.getShopCarProds(sid);
    shopCar.then(res => {
      response = res.body;
    }).catch(err => {
      console.error(err);
    }).finally(() => {
      this.shopCarSrv.showBadge.next(false);
      badgenumber = response.shopcarProds.length > 0 ? response.shopcarProds.length : 0;
      this.shopCarSrv.badgeNum.next(badgenumber);
      this.shopCarSrv.showBadge.next(badgenumber > 0 ? true : false);
    });
  }
}
