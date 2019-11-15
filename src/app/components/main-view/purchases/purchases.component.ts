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
    if (sid !== null) {
      let uname: string; let umail: string;
      this.dataService.getPurchases(sid).then(res => {
        if (!res.body.msgerr) {
          uname = res.body.fullname;
          umail = res.body.username;
          this.dataPurchase = res.body.shopCars;
        } else {
          if (res.body.msgerr) {
            this.barNotice.open(res.body.msgerr, '', { duration: 2000, panelClass: 'notice-bar-error'});
            this.shopRouter.navigate([ 'salir' ]);
          }
        }
      }).catch(err => {
        console.error('Error en la respuesta Compras: -->' + err);
      }).finally(() => {
        this.dataService.getProducts(sid).then(resp => {
          this.productsShop = resp.body;
        }).catch(error => {
          console.error('Error en la respuesta Productos: -->' + error);
        }).finally(() => {
          this.purchaseSrv.purchasesNew.next((this.purchaseSrv.buildPurchasesTree(
            this.purchaseSrv.buildShopcarsData(this.dataPurchase, this.productsShop, { usern: uname, userm: umail }))));
        });
      });
    } else {
      this.userSid.clearSid();
      this.shopRouter.navigate([ 'salir' ]);
    }
  }

  hasNested(_: number, node: PurchaseNode) { return !!node.nodenested && node.nodenested.length > 0; }
}
