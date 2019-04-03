import { Component, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { TopbarComponent } from '../topbar/topbar.component';
import { ViewProductComponent } from '../view-product/view-product.component';


@Component({
  selector: 'app-main-view',
  templateUrl: './main-view.component.html',
  styleUrls: ['./main-view.component.css']
})
export class MainViewComponent {

  constructor(private shopRouter: Router) {
    // this.shopRouter.navigate(['catalogo/productos']);
  }

}
