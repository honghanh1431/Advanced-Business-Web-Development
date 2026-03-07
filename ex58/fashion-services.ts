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
export class FashionService {
  private apiUrl = 'http://localhost:4000/api/fashions';

  constructor(private http: HttpClient) {}

  getFashions(style?: string): Observable<Fashion[]> {
    const url = style ? `${this.apiUrl}?style=${encodeURIComponent(style)}` : this.apiUrl;
    return this.http.get<Fashion[]>(url);
  }

  getFashion(id: string): Observable<Fashion> {
    return this.http.get<Fashion>(`${this.apiUrl}/${id}`);
  }

  addFashion(fashion: Fashion): Observable<Fashion> {
    return this.http.post<Fashion>(this.apiUrl, fashion);
  }

  updateFashion(id: string, fashion: Fashion): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, fashion);
  }

  deleteFashion(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}