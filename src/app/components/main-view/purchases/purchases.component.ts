import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data-service.service';
import { GetSidService } from '../../../services/get-sid.service';
import { PurchasesService, PurchaseNode } from '../../../services/purchases.service';
import { ShopCar } from '../../../data-model/shop-car';
import { Product } from '../../../data-model/product';

@Component({
  selector: 'app-purchases',
  templateUrl: './purchases.component.html',
  styleUrls: ['./purchases.component.css'],
  providers: [PurchasesService]
})
export class PurchasesComponent implements OnInit {
  private dataPurchase: ShopCar[];
  private productsShop: Product[];
  public ctrlTree: NestedTreeControl<PurchaseNode>;
  public srcData: MatTreeNestedDataSource<PurchaseNode>;

  constructor(private userSid: GetSidService, private purchaseSrv: PurchasesService, private dataService: DataService,
              private shopRouter: Router, private barNotice: MatSnackBar) {
    this.ctrlTree = new NestedTreeControl<PurchaseNode>(node => node.nodenested );
    this.srcData = new MatTreeNestedDataSource();
    this.purchaseSrv.purchasesNew.subscribe(data => this.srcData.data = data);
  }

  ngOnInit() {
    this.loadPurchases();
  }

  loadPurchases() {
    const sid = this.userSid.sendSid();
    let uname: string; let umail: string;
    this.dataService.getPurchases(sid).then(res => {
      if (!res.body.msgerr) {
        uname = res.body.fullname;
        umail = res.body.username;
        this.dataPurchase = res.body.shopCars;
      } else {
        this.barNotice.open(res.body.msgerr, '', { duration: 2000, panelClass: 'notice-bar-error'});
        throw res.error;
      }
    }).catch(err => {
      if (sid != null) { this.userSid.clearSid(); }
      this.shopRouter.navigate([ 'salir' ]);
    }).finally(() => {
      if (this.dataPurchase !== undefined) {
        this.dataService.getProducts(sid).then(resp => {
          if (resp.body.msgerr) { throw resp.error; }
          this.productsShop = resp.body;
        }).catch(error => {
          if (sid != null) { this.userSid.clearSid(); }
          this.shopRouter.navigate([ 'salir' ]);
        }).finally(() => {
          this.purchaseSrv.purchasesNew.next((this.purchaseSrv.buildPurchasesTree(
            this.purchaseSrv.buildShopcarsData(this.dataPurchase, this.productsShop, { usern: uname, userm: umail }))));
        });
      }
    });
  }

  hasNested(_: number, node: PurchaseNode) { return !!node.nodenested && node.nodenested.length > 0; }
}
