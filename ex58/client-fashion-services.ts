import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Fashion {
  _id?: string;
  style: string;
  fashion_title: string;
  fashion_details: string;
  thumbnail: string;
  creation_date?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class ClientFashionService {
  private apiUrl = 'http://localhost:4000/api/fashions';

  constructor(private http: HttpClient) {}

  getFashions(style?: string): Observable<Fashion[]> {
    const url = style ? `${this.apiUrl}?style=${encodeURIComponent(style)}` : this.apiUrl;
    return this.http.get<Fashion[]>(url);
  }

  getFashion(id: string): Observable<Fashion> {
    return this.http.get<Fashion>(`${this.apiUrl}/${id}`);
  }
}