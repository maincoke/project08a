import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { GetSidService } from '../../../services/get-sid.service';
// import { DataService } from '../../../services/data-service.service';
import { ShopCarService } from '../../../services/shop-car.service';
import { Product } from '../../../data-model/product';
import { ShopCar } from '../../../data-model/shop-car';

@Component({
  selector: 'app-shop-car',
  templateUrl: './shop-car.component.html',
  styleUrls: ['./shop-car.component.css']
})
export class ShopCarComponent implements OnInit {
  constructor(private userSid: GetSidService, public shopCarData: ShopCarService,
              private barNotice: MatSnackBar, private shopRouter: Router) { }

  ngOnInit() {
    const sid: string = this.userSid.sendSid();
    this.shopCarData.getShopCarData(sid);
    if (!this.shopCarData.error && sid) {
    /*  console.log(this.shopCarData.error + ' - Shop-Car - ' + sid);
      console.log(this.shopCarData.shopCar);
      console.log(this.shopCarData.userCar);*/
    } else {
      console.log(this.shopCarData.error);
      if (this.shopCarData.msgerr) {
        this.barNotice.open(this.shopCarData.msgerr, '', { duration: 4000, panelClass: 'notice-bar-error' });
      }
      this.shopRouter.navigate([ 'salir' ]);
    }
    // console.log('Carrito actualizado..: ' + this.shopCarData.shopCar.order +  ' --- ' + this.shopCarData.shopCar.paidod);
  }
}
