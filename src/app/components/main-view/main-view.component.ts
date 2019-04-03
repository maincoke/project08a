import { Component, Renderer2 } from '@angular/core';
import { TopbarComponent } from '../topbar/topbar.component';

@Component({
  selector: 'app-main-view',
  templateUrl: './main-view.component.html',
  styleUrls: ['./main-view.component.css']
})
export class MainViewComponent {

  constructor(private bgRender: Renderer2) {
    this.bgRender.addClass(document.body, 'bckgr-main');
  }

}
