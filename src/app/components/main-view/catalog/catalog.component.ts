import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { GetSidService } from '../../../services/get-sid.service';
import { DataService } from '../../../services/data-service.service';
import { ProdSearchPipe} from '../../../services/prod-search.pipe';
import { ShopCarService } from '../../../services/shop-car.service';
import { TopbarComponent } from '../../../components/main-view/topbar/topbar.component';
import { Product } from '../../../data-model/product';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.css']
})
export class CatalogComponent implements OnInit {
  public products: Product[];
  public prodSearcher: Product = new Product();
  public prodFilter: ProdSearchPipe;
  public stockChanger: BehaviorSubject<number>;
  constructor(private dataService: DataService, private userSid: GetSidService, private barNotice: MatSnackBar,
              private shopRouter: Router, public shopCarData: ShopCarService, private shopCarIcon: TopbarComponent) { }

  ngOnInit() {
    this.loadingProdsAndShopcar();
  }

  loadingProdsAndShopcar() {
    const sid: string = this.userSid.sendSid();
    this.dataService.getProducts(sid).then(res  => {
      if (res.body.msgerr) {
        this.barNotice.open(res.body.msgerr, '', { duration: 4000, panelClass: 'notice-bar-error' });
        throw res.error;
      } else {
        this.prodSearcher.name = '';
        this.products = res.body;
        this.shopCarData.getShopCarData(sid);
        if (this.shopCarData.error) {
          console.log(this.shopCarData.error);
          if (this.shopCarData.msgerr) {
            this.barNotice.open(this.shopCarData.msgerr, '', { duration: 4000, panelClass: 'notice-bar-error' });
          }
          throw res.error;
        } else {
          this.shopCarIcon.setIconBadge();
        }
      }
    }).catch(err => {
      if (sid != null) { this.userSid.clearSid(); }
      this.shopRouter.navigate([ 'salir' ]);
    });
  }

  addProduct2Car(prod: any, qtProd: any) {
    const prodQtt: number = parseFloat(qtProd.value);
    const stocknow: number = prod.stock - prodQtt;
    this.stockChanger =  new BehaviorSubject<number>(prod.stock);
    this.stockChanger.subscribe(stockvalue =>  prod.stock = stockvalue );
    this.stockChanger.next(stocknow);
    const sid: string = this.userSid.sendSid();
    this.shopCarData.pushProduct2Car(sid, prod._id, prod.price, prodQtt, stocknow);
    this.shopCarIcon.setIconBadge();
  }
}
