import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface PixelArt {
  id?: string;
  name: string;
  pixels: string[][];
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = `${environment.apiUrl}/pixel-art`;

  constructor(private http: HttpClient) { }

  savePixelArt(pixelArt: PixelArt): Observable<PixelArt> {
    return this.http.post<PixelArt>(this.apiUrl, pixelArt);
  }

  getAllPixelArt(): Observable<PixelArt[]> {
    return this.http.get<PixelArt[]>(this.apiUrl);
  }

  getPixelArtById(id: string): Observable<PixelArt> {
    return this.http.get<PixelArt>(`${this.apiUrl}/${id}`);
  }
}
