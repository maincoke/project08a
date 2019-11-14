import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data-service.service';
import { GetSidService } from '../../../services/get-sid.service';
import { PurchasesService, ShopcarNode, PurchaseNode } from '../../../services/purchases.service';
import { ProdsCar } from '../shop-car/shop-car.component';

@Component({
  selector: 'app-purchases',
  templateUrl: './purchases.component.html',
  styleUrls: ['./purchases.component.css'],
  providers: [PurchasesService]
})
export class PurchasesComponent implements OnInit {
  public carProds: ProdsCar[] = new Array;
  public ctrlTree: NestedTreeControl<PurchaseNode>;
  public srcData: MatTreeNestedDataSource<PurchaseNode>;

  constructor(private userSid: GetSidService, private purchaseSrv: PurchasesService, private dataService: DataService,
              private shopRouter: Router, private barNotice: MatSnackBar) {
    this.ctrlTree = new NestedTreeControl<PurchaseNode>(node => node.nodenested );
    this.srcData = new MatTreeNestedDataSource();
    this.purchaseSrv.purchasesNew.subscribe(data => this.srcData.data = data);
  }

  ngOnInit() {
    this.loadShopcars();
  }

  loadShopcars() {
    const sid = this.userSid.sendSid();
    if (sid !== null) {
      this.dataService.getPurchases(sid).then(res => {
        if (res.body.msgerr) { this.barNotice.open(res.body.msgerr, '', { duration: 2000, panelClass: 'notice-bar-error'}); }
      }).catch(err => {
        console.error(err);
      });
    } else {
      this.userSid.clearSid();
      this.shopRouter.navigate([ 'salir' ]);
    }
    console.log(this.srcData.data);
  }

  hasNested(_: number, node: PurchaseNode) { return !!node.nodenested && node.nodenested.length > 0; }
}
