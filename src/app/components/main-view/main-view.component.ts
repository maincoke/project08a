/** Componente de código Typescript para cargar la Vista Principal-UI de la Tienda Online */
import { Component, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-main-view',
  templateUrl: './main-view.component.html'
})
export class MainViewComponent {
  constructor(private bgRender: Renderer2) { this.bgRender.addClass(document.body, 'bckgr-main'); }
}
