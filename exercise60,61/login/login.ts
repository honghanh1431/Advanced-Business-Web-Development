import { Component, OnInit } from '@angular/core';
import { LoginService } from '../login-service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
  styleUrls: ['./login.css']})

export class Login implements OnInit {
  username:string=""
  password:string=""
  message:string=""
  
  constructor(private service:LoginService){}
  ngOnInit(){
    this.service.readCookie().subscribe({
      next:(data)=>{
        this.username=data.username
        this.password=data.password
      }
    })
  }
  
  login(){
    const data={
      username:this.username,
      password:this.password
    }
    this.service.login(data).subscribe({
      next:(res)=>{
        this.message="Login Success"
      },
      
      error:(err)=>{
        this.message="Login Failed"
      }
    })
  }
}