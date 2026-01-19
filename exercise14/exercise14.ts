import { Component } from '@angular/core';
import { CatalogService } from '../catalog-service';
@Component({
  selector: 'app-exercise14',
  standalone: false,
  templateUrl: './exercise14.html',
  styleUrl: './exercise14.css',
})
export class Exercise14 {
  categories: any;

  constructor(private catalogService: CatalogService) {
    this.categories = this.catalogService.getCategories();
  }
}