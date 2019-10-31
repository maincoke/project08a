import { Component, Renderer2 } from '@angular/core';
import { ShopCarService } from '../../services/shop-car.service';
import { GetSidService } from '../../services/get-sid.service';
import { TopbarComponent } from './topbar/topbar.component';

@Component({
  selector: 'app-main-view',
  templateUrl: './main-view.component.html',
  styleUrls: ['./main-view.component.css']
})
export class MainViewComponent {

  constructor(private bgRender: Renderer2, private shopCarData: ShopCarService,
              private userId: GetSidService, private topBar: TopbarComponent) {
    const sid = this.userId.sendSid();
    this.bgRender.addClass(document.body, 'bckgr-main');
  }
}
