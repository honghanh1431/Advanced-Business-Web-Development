import { Component,OnInit } from '@angular/core';
import { ProductsService } from '../products-service';

@Component({
  selector: 'app-products',
  standalone: false,
  templateUrl: './products.html',
  styleUrl: './products.css',
})

export class Products implements OnInit{
  products:any=[]
  constructor(private service:ProductsService){}
  ngOnInit(){
    this.service.getProducts().subscribe((data:any)=>{
    this.products=data
    })
  }

  addToCart(id:any){
    this.service.addToCart(id).subscribe(()=>{
    alert("Added to cart")
    })
  }
}