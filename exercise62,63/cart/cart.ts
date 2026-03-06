import { Component,OnInit } from '@angular/core';
import { ProductsService } from '../products-service';

@Component({
  selector: 'app-cart',
  standalone: false,
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})

export class Cart implements OnInit{
  cart:any=[]
  constructor(private service:ProductsService){}
  ngOnInit(){
    this.loadCart()
  }

  loadCart(){
    this.service.getCart().subscribe((data:any)=>{
    this.cart=data
    })
  }

  update(id:any,qty:any){
    this.service.updateCart(id,qty).subscribe(()=>{
    this.loadCart()
    })
  }

  remove(id:any){
    this.service.removeCart(id).subscribe(()=>{
    this.loadCart()
    })
  }
}