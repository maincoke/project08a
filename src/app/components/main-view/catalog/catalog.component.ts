import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { GetSidService } from '../../../services/get-sid.service';
import { DataService } from '../../../services/data-service.service';
import { ProdSearchPipe} from '../../../services/prod-search.pipe';
import { Product } from '../../../data-model/product';

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.css']
})
export class CatalogComponent implements OnInit {
  public products: Product[];
  public prodSearcher: Product = new Product();
  public prodFilter: ProdSearchPipe;
  constructor(private dataService: DataService, private userSid: GetSidService,
              private barNotice: MatSnackBar, private shopRouter: Router) { }

  ngOnInit() {
    const sid: string = this.userSid.sendSid();
    this.dataService.getProducts(sid).then(res  => {
      if (res.body.msgerr) {
        this.barNotice.open(res.body.msgerr, '', { duration: 4000, panelClass: 'notice-bar-error' });
        throw res.error;
      } else {
        this.products = res.body;
        // console.log(this.products);
        // Realizar carga de Productos...!!!!
      }
    }).catch(err => {
      if (sid != null) { this.userSid.clearSid(); }
      this.shopRouter.navigate([ 'salir' ]);
    });
  }

  prodName(idx: number, prod: Product ) {
    return prod.name;
  }
}
