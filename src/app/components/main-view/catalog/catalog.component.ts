import { Component, OnInit } from '@angular/core';
import { DataService } from '../../../services/data-service.service';

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.css']
})
export class CatalogComponent implements OnInit {
  public prods: [];

  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.dataService.getProducts().then(res => {
      console.log(res.body);
    }).catch(err => {
      console.error(err);
    });
  }
}
