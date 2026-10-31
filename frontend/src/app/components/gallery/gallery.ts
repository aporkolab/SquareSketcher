import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { ApiService, PixelArt } from '../../services/api';
import { ArtService } from '../../services/art';

@Component({
  selector: 'app-gallery',
  imports: [MatListModule, MatCardModule],
  templateUrl: './gallery.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './gallery.scss',
})
export class GalleryComponent {
  private readonly apiService = inject(ApiService);
  private readonly artService = inject(ArtService);

  readonly pixelArts = signal<PixelArt[]>([]);
  readonly loadFailed = signal(false);

  constructor() {
    // Runs once on start and again whenever a save changes the stored gallery.
    effect(() => {
      this.artService.galleryVersion();
      this.loadGallery();
    });
  }

  loadGallery(): void {
    this.apiService.getAllPixelArt().subscribe({
      next: (arts) => {
        // The SSR interceptor answers with an empty body.
        this.pixelArts.set(arts ?? []);
        this.loadFailed.set(false);
      },
      error: () => this.loadFailed.set(true),
    });
  }

  loadArt(art: PixelArt): void {
    this.artService.loadArt(art);
  }
}
