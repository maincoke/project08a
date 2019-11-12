import { Component, OnChanges, OnInit } from '@angular/core';
import { GetSidService } from '../../../services/get-sid.service';
import { ShopCarService } from 'src/app/services/shop-car.service';
import { DataService } from 'src/app/services/data-service.service';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.css']
})
export class TopbarComponent implements OnInit {
  public badgeNumb = 0;
  public hideBadge = false;

  constructor(private shopCarSrv: ShopCarService, private userSid: GetSidService, private dataService: DataService) {
    this.shopCarSrv.initService();
    this.shopCarSrv.showBadge.subscribe( badge =>  this.hideBadge = !badge );
    this.shopCarSrv.badgeNum.subscribe( numbdg =>  this.badgeNumb = numbdg );
  }

  ngOnInit(): void {
    this.setIconBadge();
  }

  setIconBadge() {
    const sid: string = this.userSid.sendSid();
    let response: any;
    this.dataService.getShopCarProds(sid).then(res => {
      response = res.body;
    }).catch(err => {
      console.error(err);
    }).finally(() => {
      this.shopCarSrv.badgeNum.next(response.shopcarProds.length > 0 ? response.shopcarProds.length : 0);
      this.shopCarSrv.showBadge.next(response.shopcarProds.length > 0 ? true : false);
    });
  }

  setBadgeOnAdd(numAdd: number) {
    this.shopCarSrv.badgeNum.next(this.badgeNumb + numAdd);
    this.shopCarSrv.showBadge.next(true);
  }

  setBadgeOnDeduct(numDed: number) {
    this.shopCarSrv.badgeNum.next(numDed);
    this.shopCarSrv.showBadge.next(numDed > 0 ? true : false);
  }
}
