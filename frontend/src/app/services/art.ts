import { Injectable, signal } from '@angular/core';
import { PixelArt } from './api';

@Injectable({
  providedIn: 'root',
})
export class ArtService {
  private readonly artToLoadState = signal<PixelArt | null>(null);
  private readonly galleryVersionState = signal(0);

  /** The art the user picked in the gallery, to be opened on the canvas. */
  readonly artToLoad = this.artToLoadState.asReadonly();

  /** Incremented whenever the stored gallery changes and should be reloaded. */
  readonly galleryVersion = this.galleryVersionState.asReadonly();

  loadArt(art: PixelArt): void {
    this.artToLoadState.set(art);
  }

  notifyGalleryChanged(): void {
    this.galleryVersionState.update((version) => version + 1);
  }
}
