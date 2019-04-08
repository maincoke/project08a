import { Component, Renderer2, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { GetSidService } from '../../../services/get-sid.service';
import { DataService } from '../../../services/data-service.service';

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.css']
})
export class CatalogComponent implements OnInit {
  public prods: [];
  constructor(private bgRender: Renderer2, private dataService: DataService, private userSid: GetSidService,
              private barNotice: MatSnackBar, private shopRouter: Router) { }

  ngOnInit() {
    const sid: string = this.userSid.sendSid();
    this.dataService.getProducts(sid).then(res  => {
      if (res.body.msgerr) {
        this.barNotice.open(res.body.msgerr, '', { duration: 4000, panelClass: 'notice-bar-error' });
        throw res.error;
      } else {
        this.prods = res.body;
        console.log(this.prods);
        // Realizar carga de Productos...!!!!
      }
    }).catch(err => {
      this.shopRouter.navigate([ 'salir' ]);
    });
  }

}
