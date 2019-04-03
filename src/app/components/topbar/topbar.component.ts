import { Component, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.css']
})
export class TopbarComponent {
  private routerLnk: Router;
  public catalogo: [];
  constructor(private bgRender: Renderer2) {
    this.bgRender.addClass(document.body, 'bckgr-main');
  }

  catalogLinks() {
    this.catalogo = ['/'];
  }
}
