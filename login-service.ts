import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
providedIn: 'root'
})
export class LoginService {

constructor(private http: HttpClient) {}

login(data:any):Observable<any>{
return this.http.post("http://localhost:3002/login",data)
}

readCookie():Observable<any>{
return this.http.get("http://localhost:3002/read-cookie")
}

}