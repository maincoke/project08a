import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { GetSidService } from '../../../services/get-sid.service';
import { DataService } from '../../../services/data-service.service';
import { Product } from '../../../data-model/product';

@Component({
  selector: 'app-view-product',
  templateUrl: './view-product.component.html',
  styleUrls: ['./view-product.component.css']
})
export class ViewProductComponent implements OnInit {
  public prodShow: ParamMap;
  public prodShowData: Product = new Product;

  constructor(private dataService: DataService, private userSid: GetSidService,
              private barNotice: MatSnackBar, private shopRouter: Router, private prodRoute: ActivatedRoute) { }

  ngOnInit() {
    const sid: string = this.userSid.sendSid();
    const prodId = this.prodRoute.snapshot.paramMap.get('id');
    this.dataService.getShowProduct(sid, prodId).then(res  => {
      if (res.body.msgerr) {
        this.barNotice.open(res.body.msgerr, '', { duration: 4000, panelClass: 'notice-bar-error' });
        throw res.error;
      } else {
        this.prodShowData = res.body;
      }
    }).catch(err => {
      if (sid != null) { this.userSid.clearSid(); }
      this.shopRouter.navigate([ 'salir' ]);
    });
  }
}
