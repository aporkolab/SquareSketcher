import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface PixelArt {
  id?: string;
  name: string;
  pixels: string[][];
}

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/pixel-art`;

  /** Creates the art, or updates it in place when it already has an id. */
  savePixelArt({ id, ...body }: PixelArt): Observable<PixelArt> {
    return id
      ? this.http.put<PixelArt>(`${this.apiUrl}/${encodeURIComponent(id)}`, body)
      : this.http.post<PixelArt>(this.apiUrl, body);
  }

  getAllPixelArt(): Observable<PixelArt[]> {
    return this.http.get<PixelArt[]>(this.apiUrl);
  }

  getPixelArtById(id: string): Observable<PixelArt> {
    return this.http.get<PixelArt>(`${this.apiUrl}/${encodeURIComponent(id)}`);
  }
}
