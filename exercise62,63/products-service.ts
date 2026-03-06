import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
providedIn: 'root'
})

export class ProductsService {
  api="http://localhost:3002"
  constructor(private http:HttpClient){}
  getProducts(){
    return this.http.get(this.api+"/products")
  }

  addToCart(id:any){
    return this.http.post(this.api+"/add-to-cart",{productId:id})
  }

  getCart(){
    return this.http.get(this.api+"/cart")
  }

  updateCart(productId:any,quantity:any){
    return this.http.post(this.api+"/update-cart",{productId,quantity})
  }

  removeCart(productId:any){
    return this.http.post(this.api+"/remove-cart",{productId})
  }
}