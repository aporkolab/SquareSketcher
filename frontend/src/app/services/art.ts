import { Injectable, signal } from '@angular/core';
import { PixelArt } from './api';

@Injectable({
  providedIn: 'root'
})
export class ArtService {
  artToLoad = signal<PixelArt | null>(null);

  loadArt(art: PixelArt): void {
    this.artToLoad.set(art);
  }
}
